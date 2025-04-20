<template>
	<TicketModalEditor
		ref="ticketEditor_ref"
	/>

	<DefaultLayout>
		<h1 class="text-lg font-bold">Project</h1>

		<div class="h-4"/>

		<TheSortFilterBar
			:column-options="sortKeys"
			@sort-filter-change="onSortFilterChange"
		/>

		<div class="h-2"/>

		<div class="border border-stone-500 rounded p-1 flex justify-end gap-2">
			<p class="flex items-center gap-2 w-32 text-center">
				<input type="checkbox" v-model="activeConf.showActive">
				Active
			</p>
			<p class="flex items-center gap-2 w-32 text-center">
				<input type="checkbox" v-model="activeConf.showInactive">
				Inactive
			</p>
		</div>

		<div class="h-2"/>

		<!-- TABLE -->
		<TicketRow
			:ticket="{ isHeader: true }"
		/>
		<section class="ticket-table space-y-1 max-h-[72vh] overflow-y-auto mt-1">
			<TicketRow
				v-for="t in tickets"
				:key="t.id"
				:ticket="t"
				@edit-ticket="onEditTicket"
				@open-detail="onOpenDetail"
			/>
		</section>
	</DefaultLayout>
</template>


<script>
// services
import ProjectSrv from "@/modules/project/services/ProjectSrv";
import TableSrv from "@/modules/core/services/TableSrv";
// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import TicketModalEditor from "@/modules/project/components/TicketModalEditor.vue";
import TheSortFilterBar from "@/modules/core/components/TheSortFilterBar.vue";
import TicketRow from "@/modules/project/components/TicketRow.vue";


export default {

	name: "ProjectView",
	components: {
		DefaultLayout,
		TicketModalEditor,
		TheSortFilterBar,
		TicketRow,
	},

	data() {
		return {
			sortByCol: "one",
			sortAsc: true,

			filterByCol: null,
			filterNeedle: "",
			showFilterByCol: false,

			activeConf: {
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

		// sorted & filtered tickets
		tickets() {
			let t = ProjectSrv.getTickets(
				this.sortByCol,
				this.sortAsc,
				this.filterNeedle,
				this.filterByCol,
				this.activeConf
			) ?? []

			// retrieve list labels
			t = TableSrv.getListLabels(t, "Ticket");

			return t;
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
			we navigate directly to /project/detail/:id/activity (which is a children route)
			 */
			this.$router.push({
				name: "ticket_detail_activity",
				params: {
					id: id
				}
			})
		},

	}

}
</script>


