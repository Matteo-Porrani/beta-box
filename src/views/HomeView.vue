<template>
	<DefaultLayout view-title="Home">
		<div class="home-view-root">

			<!-- (1) -->
			<div class="flex items-center gap-4 mb-10">
				<BxIcon
					icon="home"
					size="large"
				/>
				<p>Icon of size <code>"large"</code></p>
			</div>

			<!-- (2) -->
			<div class="flex items-center gap-4 mb-10">
				<p class="flex items-center text-blue-500">
					<BxIcon icon="data"/>
					Database
				</p>
				<p>Icon of default size (takes color of his <code>&lt;p&gt;</code>  parent)</p>
			</div>

			<!-- (3) -->
			<div class="flex items-center gap-4 mb-10">
				<BxIcon
					class="text-orange-500"
					icon="bolt"
					size="xlarge"
				/>
				<p>Icon of size <code>"xlarge"</code>, color is given with <code>.text-orange-500</code> class</p>
			</div>

			<!-- (4) -->
			<div class="flex items-center gap-4 mb-10">
				<BxIcon
					icon="stack"
				/>
				<p>Icon of default size</p>
			</div>

			<!-- (5) -->
			<div class="flex items-center gap-4 mb-10">
				<BxIcon
					icon="tag"
				/>
				<p>Icon of default size</p>
			</div>

			<div class="flex gap-2">
				<BxIcon icon="arrow_left"/><span>Nav</span>
				<BxIcon icon="arrow_right"/>
				<BxIcon icon="arrow_up"/>
				<BxIcon icon="arrow_down"/>

			</div>
<!--			<pre>{{ tasks }}</pre>-->
		</div>
	</DefaultLayout>
</template>

<script>

import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import { mapState } from "vuex";
import BxIcon from "@/components/UI/BxIcon.vue";


export default {
	name: 'HomeView',

	components: {
		BxIcon,
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
	@apply text-orange-500 text-sm bg-stone-600 rounded p-1;
}
</style>

