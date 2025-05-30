<!--
  CalendarView.vue
  A calendar component that displays a monthly view with navigation capabilities.
  Features:
  - Month navigation with arrow buttons
  - Current date highlighting
  - Responsive grid layout
  - French day abbreviations (L, M, M, J, V, S, D)
-->

<template>
	<DefaultLayout>
		<template #default>
			<!-- Debug display of current cursor date -->
			<pre class="text-xl">cursorDate: {{ cursorDate }}</pre>

			<!-- Month navigation header -->
			<div class="grid grid-cols-3 place-items-center gap-8 p-4 w-1/2 mx-auto">
				<!-- Previous month button -->
				<BxIconButton
					icon="caret_left"
					type="soft"
					class="w-8"
					@click="moveCursor(-1)"
				/>
				<!-- Current month and year display -->
				<h2 class="text-xl text-center">{{ monthLabel }}</h2>
				<!-- Next month button -->
				<BxIconButton
					icon="caret_right"
					type="soft"
					class="w-8"
					@click="moveCursor(1)"
				/>
			</div>

			<!-- Main calendar grid -->
			<div class="calendar-grid border border-stone-500 rounded">

				<!-- Days of week header -->
				<div class="calendar-row grid grid-cols-7 gap-2 p-1">
					<article
						v-for="d in ['L', 'M', 'M', 'J', 'V', 'S', 'D']"
						:key="d[0]"
						class="text-center text-xl rounded p-1"
					>
						<p>{{ d }}</p>
					</article>
				</div>

				<!-- Calendar days grid -->
				<div
					v-for="r in rows"
					:key="r[0]"
					class="calendar-row grid grid-cols-7 gap-2 p-1"
				>
					<!-- Individual day cells -->
					<article
						v-for="d in r"
						:key="d[0]"
						class="text-center text-2xl rounded p-1 has-[.text-yellow-500]:border-2 has-[.text-yellow-500]:border-yellow-500 py-2"
						:class="d.isPadding ? 'bg-stone-900' : 'bg-stone-600'"
					>
						<p :class="{'font-bold text-yellow-500' : d.isToday}">{{ d.date.split("-").at(2) }}</p>
					</article>
				</div>
			</div>

		</template>
	</DefaultLayout>
</template>


<script setup>
// Import required dependencies
import { ref, computed } from "vue";
import moment from "moment/moment";
import { DateTime } from "luxon";
import CalendarMakerSrv from "@/modules/admin/services/CalendarMakerSrv";

import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";


// State management
// Tracks the current month being viewed, initialized to current month
const cursorDate = ref(DateTime.now().startOf("month"));

/**
 * Navigates between months
 * @param {number} dir - Direction to move (-1 for previous, 1 for next)
 */
function moveCursor(dir) {
	if (dir < 0) {
		cursorDate.value = cursorDate.value.minus({ month: 1 })
	} else {
		cursorDate.value = cursorDate.value.plus({ month: 1 })
	}
}

// Computed properties for calendar data
const calElements = computed(() => buildMonth());

// Formats the month and year for display
const monthLabel = computed(() => {
	const { monthName, monthYear } = calElements.value;
	return `${monthName} ${monthYear}`;
});




/**
 * Organizes calendar days into weekly rows for display
 * @returns {Array} Array of weekly rows, each containing 7 days
 */
const rows = computed(() => {
	const { days } = calElements.value;
	const r = [];
	const rowsCount = days.length / 7;

	for (let i = 0; i < rowsCount; i++) {
		r[i] = days.slice(i*7, (i*7)+7)
	}

	return r;
});


/**
 * Builds the calendar data for the current month
 * @returns {Object} Calendar data including days, month name, and year
 */
function buildMonth() {
	return CalendarMakerSrv.parseCalendarTable(cursorDate.value.toISODate())
}



// Utility functions for date testing and comparison
// These functions are currently not used in the component but kept for reference

/**
 * Tests various Luxon date operations and formatting
 */
function testLuxon() {

	const start = DateTime.fromISO("2024-04-21");
	const ref = DateTime.fromISO("2024-04-21");


	console.log("toISO", start.toISO())
	console.log("toISODate", start.toISODate())

	console.log(start < ref);
	console.log(start <= ref);
	console.log(start.toMillis() === ref.toMillis());

	const startDay = DateTime.fromISO("2025-07-01");
	console.log(startDay.daysInMonth);

	[1, 2, 3].forEach(it => {
		console.log("+",it)
		const next = startDay.plus({ days: it })
		console.log(next.toLocaleString())
	})


	/*
	console.log(new Date("2025-01-01").toString()) 					// considered UTC 	=> Wed Jan 01 2025 ❌ 01:00:00 GMT+0100 (heure normale d'Europe centrale)
	console.log(new Date("2025-01-01T00:00:00").toString()) // considered LOCAL => Wed Jan 01 2025 ✅ 00:00:00 GMT+0100 (heure normale d'Europe centrale)
	*/

	console.log(
		// DateTime.fromISO("2025-01-01").toString()
		DateTime.fromISO("2025-01-01").toLocaleString(DateTime.DATETIME_HUGE)
	)

	console.log(
		// DateTime.fromISO("2025-01-01T00:00:00").toString()
		DateTime.fromISO("2025-03-31").toLocaleString(DateTime.DATETIME_HUGE)
	)

	console.log(
		DateTime.fromISO("2025-01-01T00:00:00+01:00").toString()
	)

	console.log(
		DateTime.fromISO("2025-01-01T00:00:00Z").toString()
	)

}


/**
 * Compares date handling between native Date and Moment.js
 */
function compareDateAndMoment() {
	console.log(new Date("2025-01-01T00:00:00"))  // Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d'Europe centrale)

	console.log(new Date("2025-01-01")) 					// Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d'Europe centrale)
	console.log(new Date("2025-01-01T00:00:00Z")) // Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d'Europe centrale)

	console.log(new Date("2025-05-31"))						// Sat May 31 2025 02:00:00 GMT+0200 (heure d'été d'Europe centrale)

	console.log(moment("2025-01-01T00:00:00"))		// Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d'Europe centrale)
	console.log(moment("2025-01-01"))							// Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d'Europe centrale)
	console.log(moment("2025-01-01T00:00:00Z"))   // Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d'Europe centrale)
	console.log(moment("2025-05-31"))   					// Sat May 31 2025 00:00:00 GMT+0200 (heure d'été d'Europe centrale)
}

</script>

