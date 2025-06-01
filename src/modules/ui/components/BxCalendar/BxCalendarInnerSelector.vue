<!--

DISPLAY
	arrows to move up / down (only for YEAR selection)
	12 items representing either months or years

-->


<template>
	<div
		class="relative bg-violet-800 grid grid-rows-[auto_auto_1fr_auto] gap-2"
	>

		<div class="absolute end-24 top-2">
			{{ innerMode }}
		</div>

		<BxIconButton
			text
			icon="xmark"
			class="block ms-auto"
			@click="$emit('discardInnerSelection')"
		/>

		<BxIconButton
			icon="arrow_up"
			class="block mx-auto"
		/>

		<div class="grid grid-cols-4 grid-rows-3 gap-1 bg-violet-600">
			<button
				v-for="item in items"
				:key="item"
				class="bg-violet-700 rounded"
			>
				{{ item }}
			</button>
		</div>

		<BxIconButton
			icon="arrow_down"
			class="block mx-auto"
		/>

	</div>
</template>


<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

// const
import { MONTH_NAMES } from "@/modules/ui/const/const-calendar";

const $emit = defineEmits(["discardInnerSelection"])

defineProps({
	innerMode: {
		type: [null, String],
		required: true,
	}
})

const items = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, 3 ... 12]



// const labels = computed(() => {
// 	return {
// 		$M: MONTH_NAMES,
// 	}
// })

</script>

