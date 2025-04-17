<template>
	<DefaultLayout>

		<h1 class="text-lg font-bold">Project</h1>

		<div class="h-4"/>

		<div class="flex gap-6">
			<select
				v-model="sortKey"
				class="w-64"
			>
				<option v-for="o in sortKeys" :key="o" :value="o">{{ o }}</option>
			</select>

			<select
				v-model="sortOrder"
				class="w-32"
			>
				<option value="0">ASC</option>
				<option value="1">DESC</option>
			</select>

			<input
				type="text"
				v-model="needle"
			>
		</div>

		<div class="h-4"/>

		<!-- TABLE -->
		<TicketRow
			:ticket="headerTicket"
		/>
		<div class="ticket-table space-y-1 max-h-[72vh] overflow-y-auto mt-1">
			<TicketRow
				v-for="t in tickets"
				:key="t.id"
				:ticket="t"
			/>

		</div>

	</DefaultLayout>
</template>


<script>
// services
import ProjectSrv from "@/modules/project/services/ProjectSrv";

// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import TicketRow from "@/modules/project/components/TicketRow.vue";

export default {

	name: "ProjectView",
	components: { TicketRow, DefaultLayout },

	data() {
		return {
			sortKey: "phase",
			sortOrder: 0,
			needle: "",

			// NOT REACTIVE
			sortKeys: ["phase", "status", "title", "topic", "comment", "description", "id" ],

			headerTicket: {
				isHeader: true,
				id: "id",
				status: "status",
				comment: "comment",
				hydratedTopic: { name: "topic" },
				title: "title",
				name: "name",
				description: "description",
				sprint: "sprint",
				phase: "phase",
			}
		}
	},

	computed: {
		tickets() {
			return ProjectSrv.getTickets(this.sortKey, this.sortOrder, this.needle) ?? []
		}
	},

}
</script>


<style scoped>
input,
select {
	@apply bg-stone-700 rounded text-stone-200 p-1
}
</style>

