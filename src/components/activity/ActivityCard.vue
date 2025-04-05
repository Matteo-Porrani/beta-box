<template>
	<div
		data-test="activity-card-root"
		class="border border-stone-600 rounded p-2 hover:bg-stone-700 transition-colors"
	>
		<div class="flex justify-between items-start mb-2">
			<div class="flex items-center gap-2">
				<BxIcon
					:icon="activityIcon"
					:class="iconColorClass"
					size="medium"
				/>
				<h4 class="text-lg font-semibold">{{ title }}</h4>
			</div>
			<span class="text-sm text-stone-400">{{ formattedTime }}</span>
		</div>
		
		<div class="text-sm text-stone-300">
			<p>{{ description }}</p>
		</div>

		<div v-if="tags?.length" class="flex gap-1 mt-2">
			<span
				v-for="tag in tags"
				:key="tag"
				class="text-xs bg-stone-800 text-stone-400 px-2 py-1 rounded"
			>
				{{ tag }}
			</span>
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
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			default: ""
		},
		time: {
			type: [String, Date],
			required: true
		},
		type: {
			type: String,
			default: "default"
		},
		tags: {
			type: Array,
			default: () => []
		}
	},

	data() {
		return {
			// Component data properties
		}
	},

	computed: {
		formattedTime() {
			if (!this.time) return "";
			const date = new Date(this.time);
			return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		},

		activityIcon() {
			const iconMap = {
				default: "check",
				meeting: "users",
				task: "clipboard",
				note: "note",
				call: "phone"
			};
			return iconMap[this.type] || iconMap.default;
		},

		iconColorClass() {
			const colorMap = {
				default: "text-lime-600",
				meeting: "text-blue-500",
				task: "text-yellow-500",
				note: "text-stone-400",
				call: "text-teal-500"
			};
			return colorMap[this.type] || colorMap.default;
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