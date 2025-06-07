<template>
	<div
		data-test="bx-calendar-root"
		class="w-[450px] variable-height grid grid-rows-[auto_1fr] gap-1 rounded border border-stone-500 bg-stone-800 p-1"
	>
		<BxCalendarNav
			:cursorDate="cursorDate"
			@selection-change="openInnerSelection"
			@move-cursor="onCursorMove"
		/>

		<BxCalendarInnerSelector
			v-if="innerMode"
			:cursor-date="cursorDate"
			:innerMode="innerMode"
			@discard-inner-selection="restoreDefault"
			@inner-item-selected="onInnerItemSelected"
		/>

		<BxCalendarBody
			v-else
			:rows="rows"
			:selected-day="selectedDateTime.split('@')[0]"
			@day-clicked="onDayClicked"
		/>

	</div>
</template>


<script setup>
// Vue related
import { ref, reactive, computed, defineProps, defineEmits } from 'vue';
// libs
import { DateTime } from "luxon";
// services
import CalendarMakerSrv from "@/modules/admin/services/CalendarMakerSrv";
// components
import BxCalendarNav from "@/modules/ui/components/BxCalendar/BxCalendarNav.vue";
import BxCalendarBody from "@/modules/ui/components/BxCalendar/BxCalendarBody.vue";
import BxCalendarInnerSelector from "@/modules/ui/components/BxCalendar/BxCalendarInnerSelector.vue";

const $p = defineProps({
	selectedDateTime: { type: [null, String], required: true } // '2025-06-18@00:00'
})

const $emit = defineEmits(["dayClicked"]);


const innerMode = ref(null);
const cursorDate = ref(null);
initCursorDate();
function initCursorDate() {
	cursorDate.value = ($p.selectedDateTime !== '-@00:00')
		? DateTime.fromISO($p.selectedDateTime.split("@")[0]).startOf("month")
		: DateTime.now().startOf("month");
}

function restoreDefault() {
	innerMode.value = null;
}

function openInnerSelection(mode) {
	innerMode.value = mode;
}

// =============================================

// Computed properties for calendar data
const calElements = computed(() => CalendarMakerSrv.parseCalendarTable(cursorDate.value.toISODate()));

/**
 * Organizes calendar days into weekly rows for display
 * @returns {Array} Array of weekly rows, each containing 7 days
 */
const rows = computed(() => {
	const { days, rowsCount } = calElements.value;

	// Array.from({ length: rowsCount }, callback)
	// the callback is used to generate the item
	return Array.from(
		{ length: rowsCount },
		() => days.splice(0,7)
	);
});

// =============================================

/**
 * Navigates the calendar cursor to the previous or next month
 * @param {Object} options - Navigation options
 * @param {number} [options.back=0] - If truthy, moves to previous month; otherwise moves to next month
 */
function onCursorMove({ back = 0 }) {
	cursorDate.value = cursorDate.value[back ? "minus" : "plus"]({ month: 1 })
}

function onInnerItemSelected({ mode, value }) {
	// move cursor
	cursorDate.value = DateTime.fromObject({
		day: 1,
		month: mode === "$M" ? value : cursorDate.value.month,
		year: mode === "$Y" ? value : cursorDate.value.year,
	});

	restoreDefault();
}

// =============================================

function onDayClicked(date) {
	$emit("dayClicked", date)
}

// =============================================

const FIXED = 100;
const STEP = 38;
const h = computed(() => `${FIXED + (rows.value.length * STEP)}px`)
</script>


<style scoped>
.variable-height {
	height: v-bind(h);
}
</style>
