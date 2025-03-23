<template>
	<DefaultLayout
		view-title="Tasks"
	>
		<div
			data-test="tasks-view-root"
			class=""
		>
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
import TaskForm from "@/components/forms/TaskForm.vue";
import TaskTable from "@/components/task/TaskTable.vue";


export default {
	name: 'HomeView',

	components: {
		TaskTable,
		TaskForm,
		DefaultLayout,
	},

	async mounted() {
		const r = await this.loadTasks();
		console.log("---", r)
	},

	methods: {
		...mapActions("task", ["loadTasks"]),

		onEditTask(taskId) {
			console.log("...task to be updated", taskId)
			this.$refs.task_form_ref.getTaskForPrefill(taskId);
		}
	}

};
</script>


