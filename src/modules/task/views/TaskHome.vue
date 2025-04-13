<template>
	<DefaultLayout>
		<h1 class="text-3xl">Task Home Demo</h1>

		<div class="h-24"></div>

		<router-link to="/tasks/detail/3">link to task 3</router-link>


		<div class="h-10"></div>

		<div class="text-3xl">Count : {{ taskCount }}</div>

		<div class="h-10"></div>

		<button
			@click="INCREMENT_COUNT(99)"
			class="
					py-1 px-2 flex items-center justify-center gap-1 text-xl font-medium
					text-stone-400 bg-stone-800 hover:bg-stone-700 border border-stone-700
					rounded transition-colors
				"
		>
			Double
		</button>


	</DefaultLayout>
</template>


<script>

import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import { mapMutations, mapState } from "vuex";

export default {
	name: "TaskHome",
	components: { DefaultLayout },

	computed: {
		...mapState({
			taskCount: $s => $s.task.taskCount,
		})
	},

	mounted() {
		console.log("TaskHome --")
		console.log(this.$router.getRoutes())
	},

	methods: {
		...mapMutations("task", ["INCREMENT_COUNT"])
	}
}
</script>

