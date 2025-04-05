<template>
	<div
		data-test="day-card-root"
		class="w-full bg-stone-900 rounded border border-stone-800"
	>
		<h3 class="text-sm font-medium text-stone-300 p-2 pb-0">{{ title }}</h3>
		<div class="p-2">
			<div class="space-y-2">
				<slot></slot>
			</div>
			<button
				@click="$emit('add-activity')"
				class="w-full mt-2 py-1.5 px-2 flex items-center justify-center gap-1 text-xs font-medium text-stone-400 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded transition-colors"
			>
				<BxIcon icon="plus" size="xsmall" class="text-stone-400" />
				Add Activity
			</button>
		</div>
	</div>
</template>

<script>
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "DayCard",

	components: {
		BxIcon
	},

	props: {
		title: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			required: true
		}
	},

	emits: ['add-activity']
}
</script>

<style scoped>
/* Component specific styles */
</style> 