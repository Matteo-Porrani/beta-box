<template>
	<!-- fullscreen preview for images -->
	<div id="previewWrapper" class="absolute inset-0"></div>

	<section
		data-test="default-layout-root"
		class="relative grid grid-cols-8 gap-4"
	>
		<aside
			data-test="layout-menu"
			class="bg-stone-800 rounded p-2"
		>
			<h1
				data-test="app-main-title"
				class="flex items-center gap-1 text-2xl font-bold"
			>
				<span class="inline-block h-2 w-2 rounded bg-yellow-400"></span>
				<span class="inline-block h-4 w-2 rounded bg-sky-500"></span>
				Beta-Box
			</h1>
			<span class="text-xs font-mono">{{ appVersion }}</span>

			<div class="h-10"></div>

			<slot name="menu">
				<TheMainMenu/>
			</slot>
		</aside>

		<div
			data-test="layout-content"
			class="col-span-7 bg-stone-800 rounded p-2"
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

		<div
			v-if="loading"
			data-test="app-loader"
			class="absolute grid place-content-center top-2 right-2 size-10"
		>
			<BxIcon icon="loader" size="xlarge" class="animate-spin"/>
		</div>

		<div
			v-if="notifStack.length > 0"
			data-test="app-notification"
			class="absolute flex flex-col gap-2 w-96 bottom-2 right-2 rounded p-1"
		>
			<TransitionGroup
				name="notif"
				tag="div"
				class="flex flex-col gap-2"
			>
				<BxNotif
					v-for="n in notifStack"
					:key="n.id"
					:notif="n"
					class="transform transition-all duration-300 ease-out"
				/>
			</TransitionGroup>
		</div>

	</section>
</template>


<script>
// Vue related
import { mapState } from "vuex";
// components
import TheMainMenu from "@/modules/core/components/layout/TheMainMenu.vue";

export default {
	name: "DefaultLayout",

	components: {
		TheMainMenu
	},

	props: {
		viewTitle: {
			type: [String, null],
			default: null,
		},
		hasBreadcrumb: {
			type: Boolean,
			default: false,
		}
	},

	computed: {
		...mapState({
			appVersion: $s => $s.APP_VERSION,
			loading: $s => $s.entity.loading,
			notifStack: $s => $s.notif.notifStack,
		})
	}
}
</script>

<style scoped>
.notif-enter-active,
.notif-leave-active {
	transition: all 0.3s ease-out;
}

.notif-enter-from {
	opacity: 0;
	transform: translateX(100px);
}

.notif-leave-to {
	opacity: 0;
	transform: translateX(100px);
}
</style>
