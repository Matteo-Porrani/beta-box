<template>
	<DefaultLayout view-title="Activity">
		<ActivityGrid
			:days="activities"
			@add-activity="handleAddActivity"
		/>
	</DefaultLayout>
</template>

<script>
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ActivityGrid from "@/components/activity/ActivityGrid.vue";
import ActivitySrv from "@/services/ActivitySrv";
import { mockDays } from "@/mocks/activities";
import { mapActions } from "vuex";

export default {
	name: "ActivityView",

	components: {
		DefaultLayout,
		ActivityGrid
	},

	async created() {
		await this.loadItems("day");
		await this.loadItems("activity");
		await this.loadItems("ticket");

		const activities = ActivitySrv.getActivities();
		console.log('Activities with formatted dates:', activities);
	},

	data() {
		return {
			days: mockDays
		};
	},

	computed: {
		activities() {
			return ActivitySrv.getActivities();
		}
	},

	methods: {

		...mapActions("entity", [
			"loadItems",
		]),

		handleAddActivity(date) {
			console.log('Add activity for date:', date);
			// TODO: Implement activity addition logic
		}
	}
}
</script>

<style scoped></style>

