<!--

DISPLAY
	arrows to move up / down (only for YEAR selection)
	12 items representing either months or years

-->


<template>
	<div
		class="relative grid grid-rows-[1fr_4fr_1fr] gap-2"
	>

<!--		<BxIconButton-->
<!--			text-->
<!--			icon="xmark"-->
<!--			class="block ms-auto"-->
<!--			@click="$emit('discardInnerSelection')"-->
<!--		/>-->

		<div>
			<BxIconButton
				v-if="innerMode === '$Y'"
				text
				icon="angle_up"
				class="block mx-auto"
				@click="changeStep({ back : 1 })"
			/>
		</div>

		<div class="grid grid-cols-4 grid-rows-3 gap-1">
			<button
				v-for="itemNb in items"
				:key="itemNb"
				class="bg-stone-700 rounded border-2"
				:class="isCurrent(itemNb) ? 'border-yellow-500 text-yellow-500' : 'border-transparent' "
				@click="selectInnerItem(itemNb)"
			>
				{{ labels[innerMode][itemNb] }}
			</button>
		</div>

		<div>
			<BxIconButton
				v-if="innerMode === '$Y'"
				text
				icon="angle_down"
				class="block mx-auto"
				@click="changeStep({})"
			/>
		</div>

	</div>
</template>


<script setup>
// Vue related
import { ref, computed, defineProps, defineEmits } from 'vue';
// const
import { MONTH_NAMES } from "@/modules/ui/const/const-calendar";



const $p = defineProps({
	cursorDate: {
		type: Object,
		required: true,
	},
	innerMode: {
		type: [null, String],
		required: true,
	}
})

const $emit = defineEmits(["discardInnerSelection", "innerItemSelected"])

// creates an array of 12 integers starting from 1 [1, 2, 3 ... 12]
const items = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Computes a range of years based on the current cursor date and step value
 * @returns {Object} An object mapping indices to years, where each year is offset from the cursor date's year
 * @example
 * // If cursorDate is 2024 and step is 0:
 * // Returns { 1: 2024, 2: 2025, 3: 2026, ... }
 */
const yearsRange = computed(() => {
	const startYear = Number($p.cursorDate.toFormat("yyyy")) + (step.value * 12);
	return items.reduce((acc, itemNb, idx) => {
		acc[itemNb] = startYear + idx
		return acc;
	}, {})
});

/**
 * Computes labels for months or years based on the current inner mode
 * @returns {Object} An object containing month names or year values based on innerMode
 * @property {Object} $M - Month names mapping (1-12 to month names)
 * @property {Object} $Y - Year values mapping (1-12 to years, based on step)
 */
const labels = computed(() => ({
	$M: MONTH_NAMES,
	$Y: yearsRange.value
}))

/**
 * Checks if a given value matches the current date component based on inner mode
 * @param {number} val - The value to check (1-12 for months, or year value for years)
 * @returns {boolean} True if the value matches the current date component
 */
function isCurrent(val) {
	return $p.innerMode === "$M"
		? Number($p.cursorDate.toFormat("M")) === Number(val)
		: Number($p.cursorDate.toFormat("yyyy")) === Number(labels.value.$Y[val])
}

const step = ref(0);

/**
 * Changes the step value for year navigation
 * @param {Object} options - Navigation options
 * @param {number} [options.back=0] - If truthy, decreases step; otherwise increases step
 */
function changeStep({ back = 0 }) {
	step.value = back ? step.value - 1 : step.value + 1;
}

// =============================================

function selectInnerItem(id) {
	const parsedValue = $p.innerMode === "$Y"
		? labels.value[$p.innerMode][id]
		: id;

	$emit(
		"innerItemSelected",
		{
			mode: $p.innerMode,
			value: parsedValue
		}
	)
}

</script>

