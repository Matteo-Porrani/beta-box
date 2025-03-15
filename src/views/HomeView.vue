<template>
	<DefaultLayout>
		<div class="home-view-content">
			<h1>
<!--				<IconHome color="#E1E2E9" :size="48" stroke-width="1" />-->
				<IconSmartHome color="#E1E2E9" />
				Home
			</h1>

<!--			<DummyOne :count="123"/>-->
		</div>
	</DefaultLayout>
</template>

<script>

import DummyOne from "@/components/DummyOne.vue";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import { IconHome, IconSmartHome } from '@tabler/icons-vue';


export default {
	name: 'HomeView',
	components: {
		DefaultLayout,
		// IconHome,
		IconSmartHome,
		// DummyOne
	},
};
</script>


<style>
h1 {
	display: flex;
	align-items: center;
	gap: 8px;
}
</style>
