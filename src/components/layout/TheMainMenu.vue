<template>
	<div>
		<h1>B-Box</h1>

		<router-link
			v-for="l in links"
			:key="l[0]"
			:to="l[1]"
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
div {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

h1 {
	font-size: 1.75rem;
	display: flex;
	align-items: center;
	gap: 4px;
	margin-bottom: 4rem;
}
</style>
