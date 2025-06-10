<!--
  CalendarView.vue
  A calendar component that displays a monthly view with navigation capabilities.
  Features:
  - Month navigation with arrow buttons
  - Current date highlighting
  - Responsive grid layout
  - Days abbreviations
-->

<template>
	<DefaultLayout>
		<template #default>

			<div class="h-36 border">
				<pre>currentStep: {{ currentStep }}</pre>
			</div>

			<div class="border border-red-500 h-[70vh] grid grid-cols-2 gap-1 p-1">

				<BxStepTracker
					:steps="steps"
					@step-clicked="onStepClicked"
				/>

				<div class="border rounded p-1">

					<div class="h-[50vh]">
						<div class="text-4xl">{{ currentStep }}</div>

					</div>

					<div class="flex justify-between">
						<BxButton
							label="Prev"
							@click="moveByOne({ back: 1 })"
						/>
						<BxButton
							label="Next"
							@click="moveByOne({})"
						/>
					</div>

				</div>

			</div>



<!--
			<BxDateTimeField v-model="dtValue"/>
			<div class="h-20"></div>

			<BxDateTimeField v-model="dtValue2" show-time/>
-->
		</template>
	</DefaultLayout>
</template>


<script setup>
// Vue related
import { ref, computed } from "vue";
// libs
import moment from "moment/moment";
import { DateTime } from "luxon";
// services
import CalendarMakerSrv from "@/modules/admin/services/CalendarMakerSrv";
// components
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import BxStepTracker from "@/modules/ui/components/BxStepTracker/BxStepTracker.vue";
import BxButton from "@/modules/ui/components/BxButton.vue";


const steps = ref([
	{
		index: 0,
		sectionCode: "$A",
		code: "step_0",
		label: "Blue",
		visited: true,
		error: true,
		current: false,
	},
	{
		index: 1,
		sectionCode: "$A",
		code: "step_1",
		label: "Green",
		visited: true,
		error: false,
		current: false,
	},
	{
		index: 2,
		sectionCode: "$A",
		code: "step_2",
		label: "Yellow",
		visited: true,
		error: false,
		current: true,
	},
	{
		index: 3,
		sectionCode: "$B",
		code: "step_3",
		label: "Purple",
		visited: false,
		error: false,
		current: false,
	},
	{
		index: 4,
		sectionCode: "$B",
		code: "step_4",
		label: "Violet",
		visited: false,
		error: false,
		current: false,
	},
])

const currentStep = computed(() => steps.value.find(s => s.current).code);


// =============================================

function onStepClicked(step) {
	// set step as current
	setStepAsCurrent(step)
}


/**
 * @param {Object} step
 */
function setStepAsCurrent(step) {
	// set all as not current
	for (const step of steps.value) {
		updateStepData(step.code, "current", false);
	}

	updateStepData(step.code, "current", true)
}


function updateStepData(code, property, value) {
	const target = steps.value.find(s => s.code === code);
	if (target) {
		target[property] = value;
	}
}

// =============================================

function moveByOne({ back = 0 }) {
	const currIndex = steps.value.findIndex(s => s.code === currentStep.value);
	const nextIndex = back ? currIndex - 1 : currIndex + 1;
	const nextStep = steps.value[nextIndex];
	setStepAsCurrent(nextStep);
}


// =============================================

const timeValue = ref("00:00")

const dtValue = ref(null);
const dtValue2 = ref(null);


// Tracks the current month being viewed, initialized to current month
const cursorDate = ref(DateTime.now().startOf("month"));

/**
 * Navigates the calendar cursor to the previous or next month
 * @param {Object} options - Navigation options
 * @param {number} [options.back=0] - If truthy, moves to previous month; otherwise moves to next month
 */
function moveCursor({ back = 0 }) {
	cursorDate.value = cursorDate.value[back ? "minus" : "plus"]({ month: 1 })
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
	const { days, rowsCount } = calElements.value;

	// Array.from({ length: rowsCount }, callback)
	// the callback is used to generate the item
	return Array.from(
		{ length: rowsCount },
		() => days.splice(0,7)
	);
});

/**
 * Builds the calendar data for the current month
 * @returns {Object} Calendar data including days, month name, and year
 */
function buildMonth() {
	return CalendarMakerSrv.parseCalendarTable(cursorDate.value.toISODate())
}



// ------------------------------------------------------------------------------------------

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

