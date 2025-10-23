<template>
	<div
		data-test="the-main-menu-root"
		class="flex flex-col gap-4"
	>
		<router-link
			v-for="l in links"
			:key="l.label"
			:to="l.path"
			:data-test="`main-menu-link-${l.label}`"
			:class="[
				'flex items-center gap-2 hover:underline text-base',
				isCollapsed ? 'w-full justify-center' : 'w-fit'
			]"
		>
			<BxIcon :icon="l.icon" size="small"/>
			<span v-if="!isCollapsed">{{ l.label }}</span>
		</router-link>

		<div class="border border-stone-500 mt-16"/>

		<router-link
			v-for="l in adminLinks"
			:key="l.label"
			:to="l.path"
			:data-test="`main-menu-admin-link-${l.label}`"
			:class="[
				'flex items-center gap-2 hover:underline text-base',
				isCollapsed ? 'w-full justify-center' : 'w-fit'
			]"
		>
			<BxIcon :icon="l.icon" size="small"/>
			<span v-if="!isCollapsed">{{ l.label }}</span>
		</router-link>

	</div>
</template>


<script>
import { LINKS, ADMIN_LINKS } from "@/modules/core/const/const-links";

export default {
	name: "TheMainMenu",

	props: {
		isCollapsed: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			links: LINKS,
			adminLinks: ADMIN_LINKS,
		}
	}
}
</script>


<style scoped>
.router-link-exact-active {
	@apply text-sky-500 rounded
}
</style>
