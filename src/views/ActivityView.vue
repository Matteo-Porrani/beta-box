<template>
	<DefaultLayout view-title="Activity">
		<ActivityGrid />
	</DefaultLayout>
</template>

<script>
import { mapState } from "vuex";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ActivityGrid from "@/components/activity/ActivityGrid.vue";

export default {
	name: 'ActivityView',

	components: {
		DefaultLayout,
		ActivityGrid
	},

	computed: {
		...mapState({
			activities: state => state.activity.activities,
		})
	}
};
</script>

<style scoped></style>

