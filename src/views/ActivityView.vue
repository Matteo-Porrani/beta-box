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
import { activitySrv } from "@/services/ActivitySrv";
import { mockDays } from "@/mocks/activities";
import { mapActions } from "vuex";

export default {
	name: "ActivityView",

	components: {
		DefaultLayout,
		ActivityGrid
	},

	async created() {

		for (const t of ["ticket", "day", "activity"]) {
			await this.loadItems(t);
		}

		const activities = activitySrv.getActivities();
		console.log('Activities with formatted dates:', activities);
	},

	data() {
		return {};
	},

	computed: {
		activities() {
			return activitySrv.getActivities();
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

