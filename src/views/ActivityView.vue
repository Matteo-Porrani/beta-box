<template>
	<DefaultLayout view-title="Activity">
		<div class="activity-view-root space-y-4">
			<DayCard
				:date="new Date()"
				title="Today"
			>
				<div class="p-2 bg-stone-700 rounded">
					<p>Today's activities will go here</p>
				</div>
			</DayCard>




		</div>
	</DefaultLayout>
</template>

<script>
import { mapState } from "vuex";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import DayCard from "@/components/activity/DayCard.vue";

export default {
	name: 'ActivityView',

	components: {
		DefaultLayout,
		DayCard
	},

	computed: {
		...mapState({
			activities: state => state.activity.activities,
		}),

		yesterday() {
			const date = new Date();
			date.setDate(date.getDate() - 1);
			return date;
		}
	}
};
</script>

<style scoped></style>

