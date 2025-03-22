<template>
	<DefaultLayout>
		<div class="home-view-root">
			<h2>
				Home
			</h2>

			<pre>{{ tasks }}</pre>
		</div>
	</DefaultLayout>
</template>

<script>

import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import { mapState } from "vuex";


export default {
	name: 'HomeView',

	components: {
		DefaultLayout,
	},

	computed: {
		...mapState({
			tasks: state => state.task.tasks,
		})
	}
};
</script>


