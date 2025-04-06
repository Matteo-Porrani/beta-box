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

		<div class="border border-stone-500 mt-16"></div>

		<router-link
			v-for="l in confLinks"
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
				["Activity", "/activity"],
				// ["Tasks", "/tasks"],
			],
			confLinks: [
				["Admin", "/admin"],
				["Data Manager", "/data-manager"],
				// ["Dev", "/dev"],
			]
		}
	}
}
</script>


<style scoped>
.router-link-active {
	@apply text-lime-600 border-s-2 border-lime-600 ps-1
}
</style>
