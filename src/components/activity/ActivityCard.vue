<template>
	<div
		data-test="activity-card-root"
		class="w-72 border border-stone-600 rounded overflow-hidden hover:border-stone-500 transition-colors"
	>
		<div
			class="px-2 py-1 flex justify-between items-center"
			:class="headerColorClass"
		>
			<div class="flex items-center gap-1">
				<BxIcon
					:icon="activityIcon"
					class="text-stone-800"
					size="xsmall"
				/>
				<span class="text-xs font-semibold text-stone-800">{{ typeLabel }}</span>
			</div>
			<span class="text-xs font-medium bg-stone-800 text-stone-300 px-2 py-0.5 rounded">{{ duration }}</span>
		</div>

		<div class="p-3 hover:bg-stone-700 transition-colors">
			<div class="h-10 mb-2">
				<p class="text-sm text-stone-300 line-clamp-2">{{ description }}</p>
			</div>

			<div v-if="tags?.length" class="flex flex-wrap gap-1">
				<span
					v-for="tag in tags"
					:key="tag"
					class="text-xs bg-stone-800 text-stone-400 px-2 py-1 rounded"
				>
					{{ tag }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "ActivityCard",

	components: {
		BxIcon
	},

	props: {
		description: {
			type: String,
			required: true
		},
		duration: {
			type: String,
			required: true,
			validator: (value) => /^\d{2}:\d{2}$/.test(value)
		},
		type: {
			type: String,
			required: true,
			validator: (value) => ['$D', '$R', '$A', '$E', '$O'].includes(value)
		},
		tags: {
			type: Array,
			default: () => []
		}
	},

	computed: {
		typeLabel() {
			const labelMap = {
				'$D': 'Development',
				'$R': 'Meeting',
				'$A': 'Analysis',
				'$E': 'Exchange',
				'$O': 'Other'
			};
			return labelMap[this.type] || 'Unknown';
		},

		headerColorClass() {
			const colorMap = {
				'$D': 'bg-yellow-400',
				'$R': 'bg-lime-400',
				'$A': 'bg-rose-400',
				'$E': 'bg-blue-400',
				'$O': 'bg-stone-400'
			};
			return colorMap[this.type] || 'bg-stone-400';
		},

		activityIcon() {
			const iconMap = {
				'$D': 'code',
				'$R': 'users',
				'$A': 'chart',
				'$E': 'message',
				'$O': 'dots'
			};
			return iconMap[this.type] || 'dots';
		}
	},

	methods: {
		// Component methods
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