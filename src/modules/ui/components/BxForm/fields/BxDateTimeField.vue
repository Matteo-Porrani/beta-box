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
				class="block w-24 text-xl text-stone-800 bg-stone-400 placeholder-stone-500 rounded p-1"
			>
				{{ dateTimeValue.time }}
			</button>

			<button @click="resetValue" class="text-stone-500 hover:text-pink-600">
				<BxIcon icon="xmark"/>
			</button>
		</div>

		<div class="h-1"/>

		<div class="cal-wrapper absolute">
			<BxCalendar
				v-if="calVisible"
				:selected-date-time="computedDTValue"
				@day-clicked="onDayClicked"
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

const $emit = defineEmits(["update:modelValue"]);


const calVisible = ref(false);
function toggleCalVisible() {
	calVisible.value = !calVisible.value;
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

/**
 * @param {String} date
 */
function onDayClicked(date) {
	dateTimeValue.date = date;
	model.value = computedDTValue.value;
	toggleCalVisible();
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

