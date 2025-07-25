<template>
	<div class="relative bx-date-time-field-root w-fit">

		<div
			id="dateTimeContainer"
			ref="dateTimeContainer"
			class="flex items-center gap-1"
		>
			<button
				class="block w-32 text-stone-800 bg-stone-400 placeholder-stone-500 rounded p-1"
				@click="toggleCalVisible"
			>
				{{ displayedDateValue }}
			</button>

			<button
				v-if="showTime"
				class="block w-24 text-stone-800 bg-stone-400 placeholder-stone-500 rounded p-1"
				@click="toggleTimePickerVisible"
			>
				{{ dateTimeValue.time }}
			</button>

			<BxIconButton
				icon="xmark"
				text
				no-min-width
				type="danger"
				@click="resetValue"
			/>

		</div>

		<div class="h-1"/>

		<div class="cal-wrapper absolute">
			<BxCalendar
				v-if="calVisible"
				:selected-date-time="computedDTValue"
				@day-clicked="onDayClicked"
			/>

			<BxTimePicker
				v-if="timePickerVisible"
				v-model="dateTimeValue.time"
				@time-picked="onTimePicked"
				@close-time-picker="timePickerVisible = false"
			/>

		</div>

	</div>
</template>


<script setup>
// Vue related
import { ref, reactive, computed, defineProps, defineEmits, defineModel, watch, onMounted } from 'vue';
// libs
import { DateTime } from "luxon";




// special prop
const model = defineModel();
defineProps({
	showTime: { type: Boolean, default: false }
})

// const $emit = defineEmits(["update:modelValue"]);


const calVisible = ref(false);
const timePickerVisible = ref(false);

function toggleCalVisible() {
	timePickerVisible.value = false;
	calVisible.value = !calVisible.value;
}

function toggleTimePickerVisible() {
	calVisible.value = false;
	timePickerVisible.value = !timePickerVisible.value;
}

// used to set initial value
watch(
	() => model.value,
	(newVal) => {
		if (!newVal) return;
		const [d, t] = newVal.split("@");
		dateTimeValue.date = d;
		dateTimeValue.time = t;
	}
)

// the value exposed by the DateTimeField : "2025-06-18@12:30"
const computedDTValue = computed(() => `${dateTimeValue.date ? dateTimeValue.date.toString() : "-"}@${dateTimeValue.time}`);

// the v-model
const dateTimeValue = reactive({ date: null, time: "00:00"})

// the displayed value
const displayedDateValue = computed(() => dateTimeValue.date ? DateTime.fromISO(dateTimeValue.date).toLocaleString() : "-");

// change in DATE
function onDayClicked(date) {
	dateTimeValue.date = date;
	model.value = computedDTValue.value;
	toggleCalVisible();
}

// change in TIME
function onTimePicked() {
	model.value = computedDTValue.value;
}

// =============================================

function resetValue() {
	dateTimeValue.date = null;
	dateTimeValue.time = "00:00";
	model.value = null;
}

</script>



<style scoped>
#dateTimeContainer {
	z-index: 1;
}
.cal-wrapper {
	z-index: 9999;
}
</style>

