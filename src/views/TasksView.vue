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

};
</script>


