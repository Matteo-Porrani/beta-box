<template>
	<div data-test="task-table-root">
		<div class="flex gap-4">

			<button
				class="flex items-center gap-1 bg-red-500 hover:bg-red-400 rounded py-2 px-4"
				@click="clearAll"
			>
				<BxIcon icon="trash" size="small"/>
				Clear
			</button>

		</div>

		<div class="h-4"></div>

		<table class="w-full">
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
				<!-- ACTIONS -->
				<td class="flex gap-4">
					<button
						class="bg-teal-500 rounded p-2"
						@click="openTaskForEdit(task.id)"
					>
						<BxIcon icon="edit" size="small"/>
					</button>

					<button
						class="bg-red-500 rounded p-2"
						@click="removeTask(task.id)"
					>
						<BxIcon icon="trash" size="small"/>
					</button>
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
// Vue related
import { mapActions, mapState } from "vuex";
// Components
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "TaskTable",

	components: { BxIcon },

	emitted: ["editTask"],

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
		]),

		async openTaskForEdit(id) {
			console.log("edit", id);
			this.$emit("editTask", id);
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

tr {
	display: grid;
	grid-template-columns: 1fr 5fr 2fr 1fr 1fr 2fr;
}

th {
	@apply p-2 text-start bg-stone-700
}

td {
	@apply p-2 border border-stone-700
}

</style>

