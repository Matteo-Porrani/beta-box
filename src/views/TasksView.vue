<template>
	<DefaultLayout
		view-title="Tasks"
	>
		<div data-test="tasks-view-root">
			<TaskForm
				ref="task_form_ref"
			/>

			<div class="h-20"></div>

			<TaskTable
				@edit-task="onEditTask"
			/>
		</div>
	</DefaultLayout>
</template>


<script>
// Vue
import { mapActions } from "vuex";
// Components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import TaskForm from "@/components/task/TaskForm.vue";
import TaskTable from "@/components/task/TaskTable.vue";


export default {
	name: 'HomeView',

	components: {
		TaskTable,
		TaskForm,
		DefaultLayout,
	},

	async mounted() {
		await this.loadTasks();
	},

	methods: {
		...mapActions("task", ["loadTasks"]),

		onEditTask(taskId) {
			this.$refs.task_form_ref.getTaskForPrefill(taskId);
		}
	}

};
</script>


