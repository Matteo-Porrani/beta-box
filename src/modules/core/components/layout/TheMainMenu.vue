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

		<div class="border border-stone-500 mt-16"/>

		<router-link
			v-for="l in adminLinks"
			:key="l[0]"
			:to="l[1]"
			:data-test="`main-menu-admin-link-${l[0]}`"
			class="hover:underline w-fit text-lg"
		>
			{{ l[0] }}
		</router-link>

	</div>
</template>


<script>
import { LINKS, ADMIN_LINKS } from "@/modules/core/const/const-links";

export default {
	name: "TheMainMenu",

	data() {
		return {
			links: LINKS,
			adminLinks: ADMIN_LINKS,
		}
	}
}
</script>


<style scoped>
.router-link-active {
	@apply text-sky-500 border-s-2 border-sky-500 ps-1
}
</style>
