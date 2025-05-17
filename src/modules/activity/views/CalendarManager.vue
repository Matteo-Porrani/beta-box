<template>
	<DefaultLayout>
		<template #default>

			<h2>Calendar Manager</h2>

			<pre>{{ weeks }}</pre>


		</template>
	</DefaultLayout>
</template>


<script setup>
import { computed, onMounted } from "vue"
import CalendarSrv from "@/modules/activity/services/CalendarSrv";

import DateHelperSrv from "@/modules/core/services/DateHelperSrv";

import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";



const weeks = computed(() => {
	return CalendarSrv.getDays();
})


onMounted(() => {

	const a = "2025-06-20@09:30";
	// 2025-06-20T09:30:00Z
	// 2025-06-20T09:30:00+02:00

	const utc = DateHelperSrv.createMomentFromStringUTC(a);
	console.log(utc)

	const par = DateHelperSrv.createMomentFromStringParis(a);
	console.log(par)

	const test1 = DateHelperSrv.dateIsBefore(
		"2025-02-14@00:00",
		"2025-05-31@00:00"
	)
	console.log(test1)

	const test2 = DateHelperSrv.dateIsBefore(
		"2025-05-31@00:00",
		"2025-02-14@00:00"
	)
	console.log(test2)

	const test3 = DateHelperSrv.dateIsBefore(
		"2025-05-31@00:00",
		"2025-05-31@00:00",
		true
	)
	console.log(test3)

})




</script>


