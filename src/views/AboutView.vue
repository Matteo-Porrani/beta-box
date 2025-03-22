<template>
	<DefaultLayout
		view-title="About"
	>
		<div class="about-view-root">
			<p>A simple Vue app to explore clean code & design patterns</p>
		</div>
	</DefaultLayout>
</template>

<script>

import DefaultLayout from "@/components/layout/DefaultLayout.vue";

export default {
	name: 'AboutView',
	components: {
		DefaultLayout,
	},
};
</script>


<style>
.about-view-menu {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	//border: 1px solid #C1C2C9;
}
</style>
