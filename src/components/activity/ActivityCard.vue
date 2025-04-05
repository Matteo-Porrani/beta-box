<template>
	<div
		data-test="activity-card-root"
		class="w-full border border-stone-600 rounded overflow-hidden"
	>
		<div
			class="px-2 py-0.5 flex justify-between items-center"
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

		<div class="p-2 bg-stone-900">
			<div v-if="tags?.length" class="flex flex-wrap gap-1 mb-1">
				<span
					v-for="tag in tags"
					:key="tag"
					class="text-sm font-bold bg-stone-800 text-stone-300 hover:bg-stone-700 px-2 py-0.5 rounded-md border border-stone-600 cursor-pointer"
				>
					{{ tag }}
				</span>
			</div>

			<div class="h-8 mb-1">
				<p class="text-xs text-stone-300 line-clamp-2">{{ description }}</p>
			</div>

			<div class="h-5 flex items-center">
				<a
					v-if="url"
					:href="url"
					target="_blank"
					class="text-xs text-blue-400 hover:text-blue-300 bg-stone-800 px-1.5 py-0.5 rounded truncate"
				>
					{{ url }}
				</a>
				<div
					v-else
					class="text-xs text-stone-600 bg-stone-800 px-1.5 py-0.5 rounded w-full"
				>
					No URL
				</div>
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
		},
		url: {
			type: String,
			default: ""
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