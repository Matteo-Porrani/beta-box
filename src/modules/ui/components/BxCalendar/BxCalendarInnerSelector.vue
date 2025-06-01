<!--

DISPLAY
	arrows to move up / down (only for YEAR selection)
	12 items representing either months or years

-->


<template>
	<div
		class="relative grid grid-rows-[auto_auto_1fr_auto] gap-2"
	>

<!--		<div class="absolute end-24 top-2">-->
<!--			{{ yearsRange }}-->
<!--		</div>-->

		<BxIconButton
			text
			icon="xmark"
			class="block ms-auto"
			@click="$emit('discardInnerSelection')"
		/>

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
import { ref, computed, defineProps, defineEmits } from 'vue';

// const
import { MONTH_NAMES } from "@/modules/ui/const/const-calendar";

const $emit = defineEmits(["discardInnerSelection"])

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

const items = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, 3 ... 12]

const yearsRange = computed(() => {
	const startYear = Number($p.cursorDate.toFormat("yyyy")) + (step.value * 12);

	return items.reduce((acc, itemNb, idx) => {
		acc[itemNb] = startYear + idx
		return acc;
	}, {})
});

const labels = computed(() => {
	return {
		$M: MONTH_NAMES,
		$Y: yearsRange.value
	}
})

function isCurrent(val) {
	return $p.innerMode === "$M"
		? Number($p.cursorDate.toFormat("M")) === Number(val)
		: Number($p.cursorDate.toFormat("yyyy")) === Number(labels.value.$Y[val])
}

const step = ref(0);

function changeStep({ back = 0 }) {
	step.value = back ? step.value - 1 : step.value + 1;
}


</script>

