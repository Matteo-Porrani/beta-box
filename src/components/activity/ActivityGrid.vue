<template>
	<div
		data-test="activity-grid-root"
		class="grid grid-cols-5 gap-4"
	>
		<DayCard
			v-for="day in days"
			:key="day.date"
			:day="day"
			@add-activity="$emit('add-activity', day.id)"
		>
			<div class="space-y-2">
				<ActivityCard
					v-for="activity in day.activities"
					:key="activity.id"
					:activity="activity"
					@edit-activity="onEditActivity"
				/>
			</div>
		</DayCard>
	</div>
</template>

<script>
import DayCard from "@/components/activity/DayCard.vue";
import ActivityCard from "@/components/activity/ActivityCard.vue";

export default {
	name: "ActivityGrid",

	components: {
		DayCard,
		ActivityCard
	},

	props: {
		days: {
			type: Array,
			required: true,
		}
	},

	emits: ['add-activity', 'editActivity'],

	methods: {
		onEditActivity(activityData) {
			console.log(1)
			this.$emit("editActivity", activityData);
		}
	}
}
</script>

<style scoped></style> 