<template>
	<div
		data-test="day-card-root"
		class="w-full bg-stone-900 rounded border border-stone-800"
	>
		<div class="flex justify-between items-center p-2">
			<h3 class="font-bold text-stone-300">{{ day.formattedDate }}</h3>
			<p class="bg-stone-700 rounded py-1 px-2">{{ day.totalDuration }}</p>
		</div>

		<div class="p-2">
			<div class="space-y-2">
				<slot></slot>
			</div>

			<div
				v-if="day.activities?.length > 0"
				class="h-2"
			/>

			<button
				@click="$emit('add-activity')"
				class="py-1 px-2 flex items-center justify-center gap-1 text-xs font-medium text-stone-400 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded transition-colors"
			>
				<BxIcon icon="add" size="small" class="text-stone-400" />
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
		day: {
			type: Object,
			required: true,
		}
	},

	emits: ['add-activity']
}
</script>

<style scoped>
/* Component specific styles */
</style> 