<template>
	<DefaultLayout>
		<h1 class="text-lg font-bold">Project</h1>

		<div class="h-4"/>

		<TheSortFilterBar
			:column-options="sortKeys"
			@sort-filter-change="onSortFilterChange"
		/>

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
			/>
		</section>
	</DefaultLayout>
</template>


<script>
// services
import ProjectSrv from "@/modules/project/services/ProjectSrv";
// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import TicketRow from "@/modules/project/components/TicketRow.vue";
import TheSortFilterBar from "@/modules/core/components/TheSortFilterBar.vue";

export default {

	name: "ProjectView",
	components: {
		DefaultLayout,
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

			// NOT REACTIVE
			sortKeys: ["phase", "status", "title", "topic", "comment", "description" ],

		}
	},

	computed: {

		// sorted & filtered tickets
		tickets() {
			return ProjectSrv.getTickets(
				this.sortByCol,
				this.sortAsc,
				this.filterNeedle,
				this.filterByCol
			) ?? []
		}
	},


	methods: {
		// react to changes in sort or filter
		onSortFilterChange(e) {
			const { key, value } = e;
			this[key] = value;
		},
	}

}
</script>


<style scoped>
input,
select {
	@apply bg-stone-700 rounded text-stone-200 p-1
}
</style>

