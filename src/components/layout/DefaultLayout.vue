<template>
	<section class="default-layout-root grid grid-cols-6 gap-2">
		<aside class="layout-menu bg-stone-800 rounded p-2">
			<h1 class="text-2xl font-bold">Beta-Box</h1>
			<div class="h-10"></div>
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
