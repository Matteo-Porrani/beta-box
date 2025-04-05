<template>
	<div
		data-test="activity-grid-root"
		class="grid grid-cols-5 gap-4"
	>
		<DayCard
			v-for="day in days"
			:key="day.date"
			:day="day"
			@add-activity="$emit('add-activity', day.date)"
		>
			<div class="space-y-2">
				<ActivityCard
					v-for="activity in day.activities"
					:key="activity.id"
					:activity="activity"
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
			validator: (value) => {
				return value.every(day => {
					return (
						day.date instanceof Date &&
						typeof day.title === 'string' &&
						Array.isArray(day.activities) &&
						day.activities.every(activity => {
							return (
								typeof activity.id === 'string' &&
								typeof activity.description === 'string' &&
								typeof activity.duration === 'string' &&
								typeof activity.type === 'string' &&
								Array.isArray(activity.tags) &&
								(activity.url === undefined || typeof activity.url === 'string')
							);
						})
					);
				});
			}
		}
	},

	emits: ['add-activity']
}
</script>

<style scoped></style> 