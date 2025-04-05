<template>
	<div
		data-test="activity-grid-root"
		class="grid grid-cols-5 gap-4"
	>
		<template v-for="i in 5" :key="i">
			<DayCard
				:date="new Date()"
				:title="`Day ${i}`"
			>
				<div class="space-y-2">
					<template v-if="i === 1">
						<ActivityCard
							description="Daily sync with the development team to discuss progress and blockers"
							duration="19:35"
							type="$R"
							:tags="['work', 'team', 'daily']"
						/>

						<ActivityCard
							description="Implement new user authentication flow"
							duration="21:35"
							type="$D"
							:tags="['development', 'auth']"
						/>

						<ActivityCard
							description="Analyze and optimize database queries"
							duration="23:35"
							type="$A"
							:tags="['performance', 'database']"
						/>

						<ActivityCard
							description="Review and clarify new feature requirements with the client"
							duration="01:35"
							type="$E"
							:tags="['client', 'requirements', 'communication']"
						/>

						<ActivityCard
							description="Update API documentation with new endpoints and examples"
							duration="03:35"
							type="$O"
							:tags="['documentation', 'api', 'maintenance']"
						/>
					</template>
					<template v-else>
						<ActivityCard
							description="Daily sync with the development team to discuss progress and blockers"
							duration="19:35"
							type="$R"
							:tags="['work', 'team', 'daily']"
						/>

						<ActivityCard
							description="Implement new user authentication flow"
							duration="21:35"
							type="$D"
							:tags="['development', 'auth']"
						/>

						<ActivityCard
							description="Analyze and optimize database queries"
							duration="23:35"
							type="$A"
							:tags="['performance', 'database']"
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
		// Component methods
	}
}
</script>

<style scoped></style> 