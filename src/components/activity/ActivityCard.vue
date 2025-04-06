<template>
	<div
		data-test="activity-card-root"
		class="w-full h-36 grid grid-cols-[auto_1fr] border border-stone-500 rounded overflow-hidden"
	>
		<div
			class="relative flex flex-col justify-between items-center p-0.5"
			:class="headerColorClass"
		>
			<div class="flex items-center gap-1">
				<button
					@click="onEditActivity"
				>
					<BxIcon
						icon="edit"
						class="text-stone-800"
						size="small"
					/>
				</button>
				<span class="absolute origin-left -rotate-90 bottom-1 text-sm left-2 font-semibold text-stone-800">{{ typeLabel }}</span>
			</div>

		</div>

		<div class="relative bg-stone-900 py-1 px-2 overflow-hidden">
			<div class="bg-stone-400 w-fit text-stone-800 text-end text-sm ms-auto rounded px-2 py-0.5 mb-1">{{ activity.duration }}</div>

			<div class="main-content">
				<div v-if="activity.ticketTitles?.length" class="flex flex-wrap gap-1 mb-1">
				<span
					v-for="ticket in activity.ticketTitles"
					:key="ticket"
					class="text-sm font-bold text-stone-300 px-2 py-0.5 rounded border border-stone-500"
				>
					{{ ticket }}
				</span>
				</div>

				<div class="h-12 mb-1">
					<p class="text-stone-300 line-clamp-2">{{ activity.description }}</p>
				</div>
			</div>

			<!--	URL		-->
			<div class="absolute bottom-1 left-1 right-1 overflow-ellipsis overflow-x-hidden">
				<a
					:href="activity.url"
					target="_blank"
					class="text-xs font-mono text-stone-400 hover:text-lime-600 text-nowrap"
				>
					{{ activity.url ?? '-' }}
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import BxIcon from "@/components/UI/BxIcon.vue";
import { nrm } from "@/utils/core-utils";

export default {
	name: "ActivityCard",

	components: {
		BxIcon
	},

	props: {
		activity: {
			type: Object,
			required: true,
		}
	},

	emits: ["editActivity"],

	computed: {
		typeLabel() {
			const labelMap = {
				'$D': 'develop',
				'$R': 'meet',
				'$A': 'analyze',
				'$E': 'exchange',
				'$O': 'other'
			};
			return labelMap[this.activity.type] || 'Unknown';
		},

		headerColorClass() {
			const colorMap = {
				'$D': 'bg-lime-500',
				'$R': 'bg-sky-400',
				'$A': 'bg-violet-400',
				'$E': 'bg-yellow-400',
				'$O': 'bg-stone-400'
			};
			return colorMap[this.activity.type] || 'bg-stone-400';
		},

		activityIcon() {
			const iconMap = {
				'$D': 'code',
				'$R': 'users',
				'$A': 'chart',
				'$E': 'message',
				'$O': 'dots'
			};
			return iconMap[this.activity.type] || 'dots';
		}
	},

	methods: {
		onEditActivity() {
			this.$emit("editActivity", nrm(this.activity));
		}
	},

	watch: {
		// Component watchers
	},

	mounted() {
		// Component mounted hook
	}
}
</script>

<style scoped>
/* Component specific styles */
</style> 