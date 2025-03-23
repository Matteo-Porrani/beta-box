<template>
	<DefaultLayout
		view-title="Tasks"
	>
		<div
			data-test="tasks-view-root"
			class=""
		>
			<TaskForm/>
			<div class="h-20"></div>
			<TaskTable/>
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
	}

};
</script>


