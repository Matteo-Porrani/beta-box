<template>
	<div>
		<pre>cursorDate: {{ cursorDate }}</pre>
		<pre>innerSelection: {{ innerSelection }}</pre>
		<pre>innerMode: {{ innerMode }}</pre>
	</div>

	<div class="grid gap-1 grid-rows-[auto_1fr] w-[512px] h-96 rounded border border-stone-500 p-1">
		<BxCalendarNav
			:cursorDate="cursorDate"
			@selection-change="onSelectionChange"
			@move-cursor="onCursorMove"
		/>

		<BxCalendarInnerSelector
			v-if="innerSelection"
			:cursor-date="cursorDate"
			:innerMode="innerMode"
			@discard-inner-selection="restoreDefault"
		/>

		<BxCalendarBody
			v-else
			:rows="rows"
		/>

	</div>
</template>


<script setup>
import { ref, computed } from 'vue';

// libs
import { DateTime } from "luxon";
// services
import CalendarMakerSrv from "@/modules/admin/services/CalendarMakerSrv";

// components
import BxCalendarNav from "@/modules/ui/components/BxCalendar/BxCalendarNav.vue";
import BxCalendarBody from "@/modules/ui/components/BxCalendar/BxCalendarBody.vue";
import BxCalendarInnerSelector from "@/modules/ui/components/BxCalendar/BxCalendarInnerSelector.vue";


const innerSelection = ref(false);
const innerMode = ref(null);
const cursorDate = ref(DateTime.now().startOf("month"));


function restoreDefault() {
	innerSelection.value = false;
	innerMode.value = null;
}

function openInnerSelection({ mode = "$M" }) {
	innerSelection.value = true;
	innerMode.value = mode;
}

function onSelectionChange(mode) {
	openInnerSelection({ mode })
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

</script>
