<template>
	<button
		class="flex items-center gap-1 bg-teal-500 hover:bg-teal-400 rounded py-2 px-4 text-stone-800"
		@click="loadTasks"
	>
		<BxIcon icon="refresh"/>
		Refresh
	</button>

	<div class="h-4"></div>

	<table class="w-full bg-stone-700 rounded">
		<thead>
		<tr>
			<th>ID</th>
			<th>Description</th>
			<th>Due Date</th>
			<th>Done</th>
			<th>Starred</th>
			<th>Actions</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="task in tasks" :key="task.id">
			<td>{{ task.id }}</td>
			<td>{{ task.desc }}</td>
			<td>{{ new Date(task.dueAt).toLocaleString() }}</td>
			<td class="text-center">{{ task.done ? '✓' : '✗' }}</td>
			<td class="text-center">{{ task.starred ? '⭐' : '' }}</td>
			<td>
				<button
					class="bg-red-500 text-stone-200 rounded p-2"
					@click="deleteTask(task.id)"
				>
					<BxIcon icon="trash"/>
				</button>
			</td>
		</tr>
		</tbody>
	</table>
</template>

<script>
import { db } from "@/service/db"
import { dataSrv } from "@/service/DataSrv";
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "TaskTable",
	components: { BxIcon },

	data() {
		return {
			tasks: []
		}
	},

	async mounted() {
		await this.loadTasks()

		const c = await dataSrv.count("task");
		console.log(`${c} task(s) found in table`)
	},

	methods: {

		async deleteTask(id) {
			console.log(id);
			const res = await dataSrv.delete("task", id);
			console.log("res", res);
		},

		async loadTasks() {
			try {
				// Load all tasks and sort by dueAt
				this.tasks = await db.task.orderBy('dueAt').toArray()
			} catch (error) {
				console.error('Failed to load tasks:', error)
			}
		}
	}
}
</script>


<style scoped>
td {
	@apply p-1 border-t
}

</style>