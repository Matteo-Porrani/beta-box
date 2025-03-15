<template>
	<DefaultLayout>
		<div class="about-view-content">

			<h1>About</h1>

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
