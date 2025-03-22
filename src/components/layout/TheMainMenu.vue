<template>
	<div
		data-test="the-main-menu-root"
		class="flex flex-col gap-4"
	>
		<router-link
			v-for="l in links"
			:key="l[0]"
			:to="l[1]"
			:data-test="`main-menu-link-${l[0]}`"
			class="hover:underline w-fit text-lg"
		>
			{{ l[0] }}
		</router-link>
	</div>
</template>


<script>
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
.router-link-active {
	@apply text-teal-500;
}
</style>
