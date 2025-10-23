<template>
	<!-- fullscreen preview for images -->
	<div id="previewWrapper" class="absolute inset-0"></div>

	<section
		data-test="default-layout-root"
		class="relative grid gap-4"
		:class="isSidebarCollapsed ? 'grid-cols-[auto_1fr]' : 'grid-cols-8'"
	>
		<aside
			data-test="layout-menu"
			class="bg-stone-800 rounded p-2 relative transition-all duration-300"
			:class="isSidebarCollapsed ? 'w-16' : ''"
		>
			<div :class="isSidebarCollapsed ? 'flex flex-col items-center' : ''">
				<h1
					v-if="!isSidebarCollapsed"
					data-test="app-main-title"
					class="flex items-center gap-1 text-2xl font-bold"
				>
					<span class="inline-block h-2 w-2 rounded bg-yellow-400"></span>
					<span class="inline-block h-4 w-2 rounded bg-sky-500"></span>
					Beta-Box
				</h1>
				<div
					v-else
					class="flex items-center gap-1"
				>
					<span class="inline-block h-2 w-2 rounded bg-yellow-400"></span>
					<span class="inline-block h-4 w-2 rounded bg-sky-500"></span>
				</div>
				<span v-if="!isSidebarCollapsed" class="text-xs font-mono">{{ appVersion }}</span>
			</div>

			<div class="h-10"></div>

			<slot name="menu">
				<TheMainMenu :is-collapsed="isSidebarCollapsed"/>
			</slot>

			<!-- Toggle button -->
			<button
				@click="toggleSidebar"
				data-test="sidebar-toggle-btn"
				class="absolute bottom-2 right-2 p-2 bg-stone-700 hover:bg-stone-600 rounded border border-stone-600 transition-colors"
				:title="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
			>
				<BxIcon
          :key="isSidebarCollapsed"
          :icon="isSidebarCollapsed ? 'angle_right' : 'angle_left'"
          size="small"
				/>
			</button>
		</aside>

		<div
			data-test="layout-content"
			class="bg-stone-800 rounded p-2"
			:class="isSidebarCollapsed ? '' : 'col-span-7'"
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

	data() {
		return {
			isSidebarCollapsed: false
		}
	},

	computed: {
		...mapState({
			appVersion: $s => $s.APP_VERSION,
			loading: $s => $s.entity.loading,
			notifStack: $s => $s.notif.notifStack,
		})
	},

	methods: {
		toggleSidebar() {
			this.isSidebarCollapsed = !this.isSidebarCollapsed;
		}
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
