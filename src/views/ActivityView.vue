<template>
	<DefaultLayout view-title="Activity">
		<ActivityGrid
			:days="days"
			@add-activity="handleAddActivity"
		/>
	</DefaultLayout>
</template>

<script>
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ActivityGrid from "@/components/activity/ActivityGrid.vue";
import { mockDays } from "@/mocks/activities";

export default {
	name: "ActivityView",

	components: {
		DefaultLayout,
		ActivityGrid
	},

	data() {
		return {
			days: mockDays
		};
	},

	methods: {
		handleAddActivity(date) {
			console.log('Add activity for date:', date);
			// TODO: Implement activity addition logic
		}
	}
}
</script>

<style scoped></style>

