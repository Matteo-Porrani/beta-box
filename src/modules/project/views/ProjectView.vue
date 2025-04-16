<template>
	<DefaultLayout>

		<h1 class="text-2xl font-bold">Project</h1>

		<div class="h-10"/>

		<div class="flex gap-6">
			<select
				v-model="sortKey"
				class="w-64"
			>
				<option
					v-for="o in sortKeys" :key="o"
					:value="o"
				>{{ o }}</option>
			</select>

			<select
				v-model="sortOrder"
				class="w-32"
			>
				<option value="0">ASC</option>
				<option value="1">DESC</option>
			</select>
		</div>



		<div class="h-10"/>

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
import { projectSrv } from "@/modules/project/services/ProjectSrv";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import TicketRow from "@/modules/project/components/TicketRow.vue";

export default {

	name: "ProjectView",
	components: { TicketRow, DefaultLayout },

	data() {
		return {

			sortKey: "comment",
			sortOrder: 0,

			// NOT REACTIVE
			sortKeys: ["title", "topic", "comment", "description", "id" ],

			headerTicket: {
				isHeader: true,
				id: "id",
				comment: "comment",
				hydratedTopic: { name: "topic" },
				title: "title",
				name: "name",
				description: "desc",
				sprint: "sprint",
			}
		}
	},

	computed: {
		tickets() {
			return projectSrv.getTickets(this.sortKey, this.sortOrder) ?? []
		}
	},

}
</script>


<style scoped>
select {
	@apply bg-stone-700 rounded text-stone-200 p-1
}
</style>