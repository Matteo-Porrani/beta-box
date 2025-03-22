<template>
	<section class="default-layout-root grid grid-cols-6 gap-4">
		<aside class="layout-menu bg-stone-800 rounded p-2">
			<h1 class="text-2xl font-bold mb-10">
				<span class="inline-block size-4 rounded bg-orange-500 mr-1"></span>
				<span class="inline-block size-4 rounded bg-blue-600"></span>
				Beta-Box
			</h1>

			<slot name="menu">
				<TheMainMenu/>
			</slot>
		</aside>
		<div class="layout-content col-span-5 bg-stone-800 rounded p-2">

			<div
				v-if="hasBreadcrumb"
				class="breadcrumb-wrapper bg-stone-500 mb-8"
			>
				<slot name="breadcrumb"/>
			</div>

			<h2 class="view-title text-3xl text-stone-400 font-bold mb-8">{{ viewTitle }}</h2>
			<slot/>
		</div>
	</section>
</template>


<script>
import TheMainMenu from "@/components/layout/TheMainMenu.vue";

export default {
	name: "DefaultLayout",
	components: { TheMainMenu },

	props: {
		viewTitle: {
			type: [String, null],
			default: null,
		},
		hasBreadcrumb: {
			type: Boolean,
			default: false,
		}
	}
}
</script>
