<template>
	<DefaultLayout>

		<template #default>


			<pre class="text-xl">cursorDate: {{ cursorDate }}</pre>


			<div class="grid grid-cols-3 place-items-center gap-8 p-4 w-1/2 mx-auto">
				<BxIconButton
					icon="caret_left"
					type="soft"
					class="w-8"
					@click="moveCursor(-1)"
				/>
				<h2 class="text-xl text-center">{{ monthLabel }}</h2>
				<BxIconButton
					icon="caret_right"
					type="soft"
					class="w-8"
					@click="moveCursor(1)"
				/>
			</div>



			<div class="calendar-grid border border-stone-500 rounded">

				<div class="calendar-row grid grid-cols-7 gap-2 p-1">
					<article
						v-for="d in ['L', 'M', 'M', 'J', 'V', 'S', 'D']"
						:key="d[0]"
						class="text-center text-xl rounded p-1"
					>
						<p>{{ d }}</p>
					</article>
				</div>


				<div
					v-for="r in rows"
					:key="r[0]"
					class="calendar-row grid grid-cols-7 gap-2 p-1"
				>

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
import { ref, computed } from "vue";
import moment from "moment/moment";
import { DateTime } from "luxon";
import CalendarMakerSrv from "@/modules/admin/services/CalendarMakerSrv";

import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";


const cursorDate = ref(DateTime.now().startOf("month"));

function moveCursor(dir) {
	if (dir < 0) {
		cursorDate.value = cursorDate.value.minus({ month: 1 })
	} else {
		cursorDate.value = cursorDate.value.plus({ month: 1 })
	}
}

const calElements = computed(() => buildMonth());
const monthLabel = computed(() => {
	const { monthName, monthYear } = calElements.value;
	return `${monthName} ${monthYear}`;
});




const rows = computed(() => {
	const { days } = calElements.value;
	const r = [];
	const rowsCount = days.length / 7;

	for (let i = 0; i < rowsCount; i++) {
		r[i] = days.slice(i*7, (i*7)+7)
	}

	return r;
});


function buildMonth() {
	return CalendarMakerSrv.parseCalendarTable(cursorDate.value.toISODate())
}



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
	console.log(new Date("2025-01-01").toString()) 					// considered UTC 	=> Wed Jan 01 2025 ❌ 01:00:00 GMT+0100 (heure normale d’Europe centrale)
	console.log(new Date("2025-01-01T00:00:00").toString()) // considered LOCAL => Wed Jan 01 2025 ✅ 00:00:00 GMT+0100 (heure normale d’Europe centrale)
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


function compareDateAndMoment() {
	console.log(new Date("2025-01-01T00:00:00"))  // Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d’Europe centrale)

	console.log(new Date("2025-01-01")) 					// Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d’Europe centrale)
	console.log(new Date("2025-01-01T00:00:00Z")) // Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d’Europe centrale)

	console.log(new Date("2025-05-31"))						// Sat May 31 2025 02:00:00 GMT+0200 (heure d’été d’Europe centrale)

	console.log(moment("2025-01-01T00:00:00"))		// Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d’Europe centrale)
	console.log(moment("2025-01-01"))							// Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d’Europe centrale)
	console.log(moment("2025-01-01T00:00:00Z"))   // Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d’Europe centrale)
	console.log(moment("2025-05-31"))   					// Sat May 31 2025 00:00:00 GMT+0200 (heure d’été d’Europe centrale)
}

</script>

