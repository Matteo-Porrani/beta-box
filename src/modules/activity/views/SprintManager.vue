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
				<span>Sprint Manager</span>
			</h2>

			<div class="h-2"/>

			<section class="h-[90vh] border border-stone-500 rounded p-1">

				<BxOptionSelector
					v-if="sprints.length > 0"
					:select-options="options"
					:init-value="sprints.at(-1).id"
					@option-selected="onOptionSelected"
				/>


				<div class="my-6">
					<BxButton
						label="Download PDF"
						@click="downloadReview"
					/>
				</div>


				<div
					v-if="sprintActivities"
					class="space-y-2"
				>

					<article
						v-for="a in sprintActivities"
						:key="a.id"
						class="bg-stone-900 rounded grid grid-cols-3 gap-2 p-1"
					>
						<p>{{ a.formattedDate }}</p>
						<p>{{ a.parsedActivities }}</p>
					</article>

				</div>


			</section>
		</template>
	</DefaultLayout>
</template>


<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router";

import { activitySrv } from "@/modules/activity/services/ActivitySrv";

import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import SprintSrv from "@/modules/activity/services/SprintSrv";
import PDFMakerSrv from "@/modules/core/services/PDFMakerSrv";


const $router = useRouter()

const selectedSprintId = ref(null);

const sprints = computed(() => SprintSrv.getHydratedSprints());
const options = computed(() => sprints.value ? sprints.value.map(s => ({ id: s.id, label: s.name })): []);
const selectedSprint = computed(() => sprints.value ? sprints.value.find(s => s.id === selectedSprintId.value) : null);
const currentRange = computed(() => selectedSprint.value ? { start: selectedSprint.value.startDate, end: selectedSprint.value.endDate } : null);
const sprintActivities = computed(() => {
	if (!currentRange.value) return [];

	const days = activitySrv.getActivitiesByRange({ start: currentRange.value.start, end: currentRange.value.end });

	return days.map(d => {
		return {
			...d,
			parsedActivities: parseActivities(d.activities)
		}
	})
})

function onOptionSelected(id) {
	selectedSprintId.value = id;
}


function parseActivities(activities) {

	const r = [];

	for (const a of activities) {
		if (a.ticketInfo) {

			const info = a.ticketInfo.reduce((acc, el) => {
				acc.push(el.title)
				return acc;
			}, [])

			r.push(info.join(" + "))
		}
	}

	return r.join(" - ");

}


function downloadReview() {
	console.log("sprintActivities", sprintActivities)
	const tableRows = sprintActivities.value.map(day => {
		return [
			day.formattedDate,
			day.parsedActivities
		]
	})

	console.log(tableRows)

	PDFMakerSrv.downloadSprintReview(
		selectedSprintId.value,
		tableRows
	)
}
</script>


