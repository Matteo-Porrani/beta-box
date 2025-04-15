<template>
	<div
		data-test="day-card-root"
		class="w-full bg-stone-900 rounded border-2"
		:class="day.isCurrentDay ? 'border-yellow-400' : 'border-transparent'"
	>
		<div class="flex justify-between items-center font-bold text-stone-300 p-2">
			<h3>{{ day.formattedDate }}</h3>
			<p>{{ day.totalDuration }}</p>
		</div>

		<!-- PARTS BAR -->
		<div class="px-2 mb-2">
			<div class="flex rounded h-2 overflow-hidden">
				<div
					v-for="t in Object.entries(day.parts)"
					:key="t[0]"
					:class="bgColorMap[t[0]]"
					:style="`width: ${t[1]}%`"
				/>
			</div>
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
				class="
					py-1 px-2 flex items-center justify-center gap-1 text-xs font-medium
					text-stone-400 bg-stone-800 hover:bg-stone-700 border border-stone-700
					rounded transition-colors
				"
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

	emits: ['add-activity'],

	data() {
		return {
			bgColorMap: {
				$D: 'bg-yellow-400',
				$A: 'bg-purple-500',
				$R: 'bg-sky-400',
				$E: 'bg-orange-500',
				$O: 'bg-stone-400',
			}
		}
	}
}
</script>

<style scoped>
/* Component specific styles */
/*

bg-yellow-400 // develop
bg-purple-500 // analyze
bg-sky-400 // meet
bg-orange-500 // exchange
bg-stone-400 // other

 */

</style> 