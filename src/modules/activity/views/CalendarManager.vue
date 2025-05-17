<template>
	<DefaultLayout>
		<template #default>

			<h2 class="flex items-center gap-1 text-lg">
				<BxIconButton
					text
					icon="angle_left"
					class="min-w-2"
					@click="$router.push({ name: 'activity_root' })"
				/>
				<span>Calendar Manager</span>
			</h2>

			<div class="h-2"/>

			<section class="h-[90vh] space-y-1 border border-stone-500 rounded p-1">

				<template v-if="mode==='list'">
					<h3 class="text-lg">Weeks</h3>

					<BxButton
						label="Add"
						@click="switchToForm"
					/>

					<WeekDisplayItem
						v-for="w in weeks"
						:key="w.id"
						:week="w"
					/>
				</template>

				<template v-else>
					<WeekCreator
						@close="mode = 'list'"
						@days-selected="onDaysSelected"
					/>
				</template>

			</section>
		</template>
	</DefaultLayout>
</template>


<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router";
import CalendarSrv from "@/modules/activity/services/CalendarSrv";


import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import WeekDisplayItem from "@/modules/activity/components/calendar-manager/WeekDisplayItem.vue";
import WeekCreator from "@/modules/activity/components/calendar-manager/WeekCreator.vue";

const $router = useRouter()
const mode = ref("list");

const weeks = computed(() => {
	return CalendarSrv.getWeeks();
})

function switchToForm() {
	mode.value = "form";
}

async function onDaysSelected(days) {
	console.log("+++ onDaysSelected", days)
	await CalendarSrv.generateWeek(days);

	// setTimeout(() => {
	// 	$router.push({ name: "activity_root" })
	// }, 1000)
}

</script>


