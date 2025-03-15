<template>
	<section class="default-layout-root">
		<aside class="layout-menu">
			<slot name="menu">
				<TheMainMenu/>
			</slot>
		</aside>
		<div class="layout-content">
			<slot/>
		</div>
	</section>
</template>


<script>
import TheMainMenu from "@/components/layout/TheMainMenu.vue";

export default {
	name: "DefaultLayout",
	components: { TheMainMenu },
}
</script>


<style scoped>
.default-layout-root {
	display: grid;
	grid-template-columns: 1fr 5fr;
	gap: 1rem;
}

.layout-menu {
	background: #414349;
	border-radius: 4px;
	padding: 1rem;
}

.layout-content {
	background-color: #313339;
	//background-image:
	//	linear-gradient(#414349 1px, transparent 1px),
	//	linear-gradient(90deg, #414349 1px, transparent 1px);
	//background-size: 2vw 2vw;
	border-radius: 4px;
	padding: 1rem;
}
</style>
