<template>
	<DefaultLayout>
		<div class="about-view-root">
			<h2>About</h2>
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
