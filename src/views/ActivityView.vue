<template>
	<DefaultLayout view-title="Activity">
		<ActivityGrid
			:days="activities"
			@add-activity="handleAddActivity"
		/>
	</DefaultLayout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { activitySrv } from "@/services/ActivitySrv";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ActivityGrid from "@/components/activity/ActivityGrid.vue";

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

		...mapGetters("entity", [
			"getListOptions",
			"getEntityDescription"
		]),

		activities() {
			return activitySrv.getActivities();
		},

		activityFormDesc() {
			return this.getEntityDescription("activity")
		},
	},

	methods: {

		...mapActions("entity", [
			"loadItems",
		]),

		handleAddActivity(date) {
			console.log('Add activity for dayID:', date);
			// TODO: Implement activity addition logic
		}
	}
}
</script>

<style scoped></style>

