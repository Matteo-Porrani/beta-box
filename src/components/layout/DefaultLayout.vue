<template>
	<section
		class="default-layout-root grid grid-cols-6 gap-2"
	>
		<aside class="layout-menu bg-stone-800 rounded p-2">
			<slot name="menu">
				<TheMainMenu/>
			</slot>
		</aside>
		<div class="layout-content col-span-5 bg-stone-800 rounded p-2">
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
	//display: grid;
	//grid-template-columns: 1fr 5fr;
	//gap: 1rem;
}

.layout-menu {
	//background: #414349;
	//background: #313339;
	//border-radius: 4px;
	//padding: 1rem;
}

.layout-content {
	//background-color: #313339;
	////background-image:
	////	linear-gradient(#414349 1px, transparent 1px),
	////	linear-gradient(90deg, #414349 1px, transparent 1px);
	////background-size: 2vw 2vw;
	//border-radius: 4px;
	//padding: 1rem;
}
</style>
