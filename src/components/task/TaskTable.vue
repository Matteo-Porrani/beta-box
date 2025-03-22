<template>

	<div class="flex gap-4">

		<button
			class="bg-red-500 hover:bg-red-400 rounded py-2 px-6 text-stone-800"
			@click="clearAll"
		>
			Clear
		</button>

	</div>



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
<!--			<td>{{ new Date(task.dueAt).toLocaleString() }}</td>-->
			<td>{{ task.dueAt }}</td>
			<td>{{ task.done ? '✓' : '✗' }}</td>
			<td>{{ task.starred ? '⭐' : '' }}</td>
			<td class="flex gap-4">
				<button
					class="bg-teal-500 text-stone-200 rounded p-2"
					@click="editTask(task.id)"
				>
					<BxIcon icon="edit" size="small"/>
				</button>

				<button
					class="bg-red-500 text-stone-200 rounded p-2"
					@click="removeTask(task.id)"
				>
					<BxIcon icon="trash" size="small"/>
				</button>
			</td>
		</tr>
		</tbody>
	</table>
</template>

<script>
import { mapActions, mapState } from "vuex";
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "TaskTable",

	components: { BxIcon },

	data() {
		return {}
	},

	computed: {
		...mapState({
			tasks: $s => $s.task.tasks,
		})
	},


	methods: {

		...mapActions("task", [
			"loadTasks",
			"deleteTask",
			"clearTasks",
		]),

		async editTask(id) {
			console.log("edit", id);
		},

		async removeTask(id) {
			const res = await this.deleteTask({ taskId: id });
			console.log("res", res);
		},

		async clearAll() {
			const res = await this.deleteTask({
				taskId: null,
				all: true
			});
			console.log("res", res);
		}

	}
}
</script>


<style scoped>
td {
	@apply p-1 border-t
}

th {
	@apply text-start
}

</style>