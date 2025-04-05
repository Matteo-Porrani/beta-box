<template>
	<div
		data-test="activity-grid-root"
		class="grid grid-cols-5 gap-4"
	>
		<template v-for="i in 5" :key="i">
			<DayCard
				:date="new Date()"
				:title="`Day ${i}`"
				@add-activity="handleAddActivity(i)"
			>
				<div class="space-y-2">
					<template v-if="i === 1">
						<ActivityCard
							description="Daily sync with the development team to discuss progress and blockers"
							duration="19:35"
							type="$R"
							:tags="['1234', '5678']"
							url="https://meet.google.com/abc-defg-hij"
						/>

						<ActivityCard
							description="Implement new user authentication flow"
							duration="21:35"
							type="$D"
							:tags="['2345', '6789']"
							url="https://github.com/org/repo/pull/123"
						/>

						<ActivityCard
							description="Analyze and optimize database queries"
							duration="23:35"
							type="$A"
							:tags="['3456', '7890']"
						/>

						<ActivityCard
							description="Review and clarify new feature requirements with the client"
							duration="01:35"
							type="$E"
							:tags="['4567', '8901']"
							url="https://docs.google.com/document/d/123"
						/>

						<ActivityCard
							description="Update API documentation with new endpoints and examples"
							duration="03:35"
							type="$O"
							:tags="['5678', '9012']"
							url="https://confluence.company.com/api-docs"
						/>
					</template>
					<template v-else>
						<ActivityCard
							description="Daily sync with the development team to discuss progress and blockers"
							duration="19:35"
							type="$R"
							:tags="['1234', '5678']"
						/>

						<ActivityCard
							description="Implement new user authentication flow"
							duration="21:35"
							type="$D"
							:tags="['2345', '6789']"
						/>

						<ActivityCard
							description="Analyze and optimize database queries"
							duration="23:35"
							type="$A"
							:tags="['3456', '7890']"
						/>
					</template>
				</div>
			</DayCard>
		</template>
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

	data() {
		return {
			// Component data properties
		}
	},

	computed: {
		// Component computed properties
	},

	methods: {
		handleAddActivity(dayIndex) {
			this.$emit('add-activity', dayIndex);
		}
	},

	emits: ['add-activity']
}
</script>

<style scoped></style> 