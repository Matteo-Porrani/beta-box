<template>
	<DefaultLayout>
		<template #default>

			<h2>Calendar Manager</h2>

			<pre>{{ weeks }}</pre>


		</template>
	</DefaultLayout>
</template>


<script setup>
import { computed } from "vue"
import CalendarSrv from "@/modules/activity/services/CalendarSrv";
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";



const weeks = computed(() => {
	return CalendarSrv.getDays();
})





</script>


