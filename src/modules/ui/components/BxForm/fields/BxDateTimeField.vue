<template>
	<div class="bx-date-time-field-root w-fit">

<!--		<div>-->
<!--			<pre>computedDTValue: {{ computedDTValue }}</pre>-->
<!--		</div>-->

		<div class="flex gap-1">
			<button
				class="block w-48 text-xl text-stone-800 bg-stone-400 placeholder-stone-500 rounded p-1"
				@click="toggleCalVisible"
			>
				{{ displayedDateValue }}
			</button>

			<button
				class="block w-24 text-xl text-stone-800 bg-stone-400 placeholder-stone-500 rounded p-1"
			>
				{{ dateTimeValue.time }}
			</button>
		</div>

		<div class="h-2"/>

		<BxCalendar
			v-if="calVisible"
			:selected-date-time="computedDTValue"
			@day-clicked="onDayClicked"
		/>

	</div>
</template>


<script setup>
// Vue related
import { ref, reactive, computed, defineProps, defineEmits, defineModel } from 'vue';
// libs
import { DateTime } from "luxon";
// services
import BxCalendar from "@/modules/ui/components/BxCalendar/BxCalendar.vue";


const model = defineModel()
// defineProps({
// 	model: { type: String, required: true }
// })

const $emit = defineEmits(["update:modelValue"])


const calVisible = ref(false);
function toggleCalVisible() {
	calVisible.value = !calVisible.value;
}

// the value exposed by the DateTimeField : "2025-06-18@12:30"
const computedDTValue = computed(() => `${dateTimeValue.date ? dateTimeValue.date.toString() : "-"}@${dateTimeValue.time}`);
// the v-model
const dateTimeValue = reactive({ date: null, time: "00:00"})
// the displayed value
const displayedDateValue = computed(() => dateTimeValue.date ? DateTime.fromISO(dateTimeValue.date).toLocaleString() : "-");

/**
 * @param {String} date
 */
function onDayClicked(date) {
	dateTimeValue.date = date;
	// $emit("update:modelValue", computedDTValue)
	model.value = computedDTValue.value;
	toggleCalVisible();
}
// =============================================
</script>

