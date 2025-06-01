<!--

DISPLAY:
	navigation arrows and month / year labels

INTERACTION
	click on navigation arrows moves to prev / next month
	click on month / year opens inner selection

EMITS
	"selectionChange", mode
	"moveCursor", { back: boolean }

-->


<template>
	<div class="flex gap-2 justify-between">
		<BxIconButton
			icon="angle_left"
			type="soft"
			class="w-8"
		/>

		<BxButton
			text
			:label="labels.month"
			@click="$emit('selectionChange', '$M')"
		/>
		<BxButton
			text
			:label="labels.year"
			@click="$emit('selectionChange', '$Y')"
		/>

		<BxIconButton
			icon="angle_right"
			type="soft"
			class="w-8"
		/>
	</div>
</template>


<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const $p = defineProps({
	cursorDate: {
		type: Object,
		required: true,
	}
})

const $emit = defineEmits(["selectionChange"])

const labels = computed(() => {
	return {
		month: $p.cursorDate.toFormat("MMMM"),
		year: $p.cursorDate.toFormat("yyyy"),
	}
})

</script>
