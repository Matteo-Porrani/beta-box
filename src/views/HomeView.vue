<template>
	<DefaultLayout view-title="Home">
		<div class="home-view-root">

		</div>
	</DefaultLayout>
</template>

<script>
import { mapState } from "vuex";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";


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


<style scoped>
code {
	@apply text-rose-400 text-sm bg-stone-700 rounded p-1;
}
</style>

