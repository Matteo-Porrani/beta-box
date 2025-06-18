<template>
	<TheSortFilterBar
		ref="sortFilterBar_ref"
		:column-options="sortKeys"
		@sort-filter-change="onSortFilterChange"
		@filter-reset="onPredefinedFilterChange({ value: 0 })"
	/>

	<div class="h-1"/>

	<div class="border border-stone-500 rounded p-1 flex justify-between items-center gap-2 h-12">

		<div class="">
			<BxFormField
				ref="filterSelect_ref"
				:fieldDesc="filterSelectDesc"
				class="border-0"
				@valueChanged="onPredefinedFilterChange"
			/>
		</div>

		<div class="flex gap-4">
			<div class="flex gap-2 items-center w-48">
				<BxSwitch v-model="compactTable"/>
				<span>Compact view</span>
			</div>

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

	<p class="mt-2">{{ tickets.length }} tickets</p>

	<!-- TABLE -->
	<TicketRow
		:ticket="{ isHeader: true }"
		:compact="compactTable"
	/>
	<section class="ticket-table space-y-1 max-h-[72vh] overflow-y-auto py-1">
		<TicketRow
			v-for="t in tickets"
			:key="t.id"
			:ticket="t"
			:compact="compactTable"
			@edit-ticket="onEditTicket"
			@open-detail="onOpenDetail"
		/>
	</section>
</template>


<script>
// services
import ProjectSrv from "@/modules/project/services/ProjectSrv";
import FilterSrv from "@/modules/project/services/FilterSrv";
// components
import TheSortFilterBar from "@/modules/core/components/TheSortFilterBar.vue";
import TicketRow from "@/modules/project/components/TicketRow.vue";
import { isFalsy, nrm } from "@/modules/core/utils/core-utils";
import { nextTick } from "vue";


export default {

	name: "ProjectView",
	components: {
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
		},

		filterSelectDesc() {
			return {
				"type": "L",
				"field": "Filter",
				// "entity": "Dummy",
				// "order": 3,
				// "pk": true,
				// "list": "$feelings",
				// "multiple": false,
				// "readonly": false,
				// "picker_col": false,
				// "required": false,
				// "id": 24,
				"options": FilterSrv.getFilterOpts()
			}
		}
	},

	methods: {
		// react to changes in sort or filter
		onSortFilterChange(e) {
			const { key, value } = e;
			this[key] = value;
		},

		onEditTicket(id) {
			this.$emit("editTicket", id)
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
				params: { id: id },
				query: { from: "project_board" }
			})
		},

		/**
		 * Reacts to selection of a predefined filter
		 * @param { { key: string, value: string } } payload
		 */
		onPredefinedFilterChange(payload) {
			if (!this.$refs.sortFilterBar_ref) return;
			const { value } = payload;

			// this is reset
			if (Number(value) < 1) {
				this.$refs.filterSelect_ref.initField(0);
				return;
			}

			const filter = FilterSrv.getFilterById(value)
			if (filter) this.applyFilter(filter);
		},

		applyFilter(f) {
			if (!isFalsy(f.filterNeedle)) {
				// this will activate switch, then we need to wait for next tick
				this.$refs.sortFilterBar_ref.setKeyToValue("showFilterByCol", true);

				nextTick(() => {
					[
						"filterNeedle",
						"filterByCol",
						"sortByCol",
						"sortAsc",
					].forEach(key => this.$refs.sortFilterBar_ref.setKeyToValue(key, f[key]))
				})
			}
		}

	}

}
</script>


