<!--
'model' is duration in minutes
'internalValue' is duration as hh:mm
-->


<template>
	<div>
		<div class="flex items-center gap-2">
			<button
				class="relative block w-16 text-stone-800 bg-stone-400 placeholder-stone-500 rounded p-1"
				@click="togglePickerVisible"
			>
				{{ internalValue }}
			</button>

			<p class="text-stone-500">{{ model }} min</p>
		</div>

		<div class="h-1"/>

		<BxTimePicker
			class="absolute"
			v-if="timePickerVisible"
			v-model="internalValue"
			@time-picked="onTimePicked"
			@close-time-picker="timePickerVisible = false"
		/>
	</div>
</template>


<script setup>
import { ref, reactive, computed, defineProps, defineModel, defineEmits, watch } from 'vue'
import { formatDurationFromMin, parseDurationInMin } from "@/modules/core/utils/core-utils";


const model = defineModel();

const timePickerVisible = ref(false);
const internalValue = ref(null)

function togglePickerVisible() {
	timePickerVisible.value = !timePickerVisible.value;
}

// used to set initial value
watch(
	() => model.value,
	(newVal) => {
		if (!newVal) {
			model.value = 0;
			internalValue.value = "00:00"
		} else {
			internalValue.value = formatDurationFromMin(model.value);
		}
	}
)

function onTimePicked(timeValue) {
	internalValue.value = timeValue;
	model.value = parseDurationInMin(internalValue.value);
}
</script>


