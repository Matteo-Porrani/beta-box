<template>
	<section
		data-test="default-layout-root"
		class="grid grid-cols-6 gap-4"
	>
		<aside
			data-test="layout-menu"
			class="bg-stone-800 rounded p-2"
		>
			<h1
				data-test="app-main-title"
				class="text-2xl font-bold mb-10"
			>
				<span class="inline-block size-4 rounded-full bg-teal-500 mr-1"></span>
				<span class="inline-block size-4 rounded-full bg-blue-500"></span>
				Beta-Box
			</h1>

			<slot name="menu">
				<TheMainMenu/>
			</slot>
		</aside>

		<div
			data-test="layout-content"
			class="col-span-5 bg-stone-800 rounded p-2"
		>
			<div
				v-if="hasBreadcrumb"
				data-test="breadcrumb-wrapper"
				class="bg-stone-500 mb-8"
			>
				<slot name="breadcrumb"/>
			</div>

			<h2
				v-if="viewTitle"
				data-test="view-title"
				class="text-3xl font-bold mb-8"
			>
				{{ viewTitle }}
			</h2>

			<!-- main content will go here (default slot) -->
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
