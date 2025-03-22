<template>
	<div class="the-main-menu-root flex flex-col gap-4">
		<router-link
			v-for="l in links"
			:key="l[0]"
			:to="l[1]"
			class="hover:text-orange-500"
		>{{ l[0] }}</router-link>
	</div>
</template>


<script>
// import {
// 	IconPackage,
// 	IconHome,
// 	IconStack2,
// } from "@tabler/icons-vue"

export default {
	name: "TheMainMenu",
	components: {},

	data() {
		return {
			links: [
				["Home", "/"],
				["Tasks", "/tasks"],
				["About", "/about"],
			]
		}
	}
}
</script>


<style scoped>

</style>
