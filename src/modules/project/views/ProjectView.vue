<template>
	<TicketModalEditor
		ref="ticketEditor_ref"
	/>

	<DefaultLayout>
		<TheSortFilterBar
			:column-options="sortKeys"
			@sort-filter-change="onSortFilterChange"
		/>

		<div class="h-1"/>

		<div class="border border-stone-500 rounded p-1 flex justify-between items-center gap-2 h-10">
			<div class="flex gap-2 items-center">
				<BxSwitch v-model="compactTable"/>
				<span>Compact view</span>
			</div>

			<div class="flex gap-2">
				<p class="flex items-center gap-2 w-32 text-center">
					<input type="checkbox" v-model="activeFilter.showActive">
					Active
				</p>
				<p class="flex items-center gap-2 w-32 text-center">
					<input type="checkbox" v-model="activeFilter.showInactive">
					Inactive
				</p>
			</div>
		</div>

		<div class="h-8"/>

		<!-- TABLE -->
		<TicketRow
			:ticket="{ isHeader: true }"
			:compact="compactTable"
		/>
		<section class="ticket-table space-y-1 max-h-[72vh] overflow-y-auto mt-1">
			<TicketRow
				v-for="t in tickets"
				:key="t.id"
				:ticket="t"
				:compact="compactTable"
				@edit-ticket="onEditTicket"
				@open-detail="onOpenDetail"
			/>
		</section>
	</DefaultLayout>
</template>


<script>
// services
import ProjectSrv from "@/modules/project/services/ProjectSrv";
// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import TicketModalEditor from "@/modules/project/components/TicketModalEditor.vue";
import TheSortFilterBar from "@/modules/core/components/TheSortFilterBar.vue";
import TicketRow from "@/modules/project/components/TicketRow.vue";
import BxSwitch from "@/components/UI/BxForm/fields/BxSwitch.vue";


export default {

	name: "ProjectView",
	components: {
		BxSwitch,
		DefaultLayout,
		TicketModalEditor,
		TheSortFilterBar,
		TicketRow,
	},

	data() {
		return {
			// table display
			compactTable: false,

			// sort & filter
			sortByCol: "phase",
			sortAsc: true,

			showFilterByCol: false,
			filterByCol: null,
			filterNeedle: "",

			activeFilter: {
				showActive: true,
				showInactive: false,
			},

			// NOT REACTIVE
			sortKeys: [
				"phase",
				"status",
				"topic",
				"title",
				"team",
				"comment",
				"description",
				"sprint",
				"active"
			],
		}
	},

	computed: {
		// hydrated, sorted & filtered tickets
		tickets() {
			return ProjectSrv.getTickets(
				this.sortByCol,
				this.sortAsc,
				this.filterNeedle,
				this.filterByCol,
				this.activeFilter
			) ?? []
		}
	},

	methods: {
		// react to changes in sort or filter
		onSortFilterChange(e) {
			const { key, value } = e;
			this[key] = value;
		},

		onEditTicket(id) {
			this.$refs.ticketEditor_ref.openEditor(id);
		},

		/**
		 * Open detail of a ticket in full page display
		 * @param id
		 */
		onOpenDetail(id) {
			/*
			instead of navigating to /project/detail/:id
			we navigate directly to /project/detail/:id/notes (which is a children route)
			 */
			this.$router.push({
				name: "ticket_detail_notes",
				params: { id: id }
			})
		},

	}

}
</script>


