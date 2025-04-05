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

export default {
	name: "ActivityView",

	components: {
		DefaultLayout,
		ActivityGrid
	},

	data() {
		return {
			days: [
				{
					date: new Date(),
					title: "Day 1",
					activities: [
						{
							id: "1",
							description: "Daily sync with the development team to discuss progress and blockers",
							duration: "19:35",
							type: "$R",
							tags: ["1234", "5678"],
							url: "https://meet.google.com/abc-defg-hij"
						},
						{
							id: "2",
							description: "Implement new user authentication flow",
							duration: "21:35",
							type: "$D",
							tags: ["2345", "6789"],
							url: "https://github.com/org/repo/pull/123"
						},
						{
							id: "3",
							description: "Analyze and optimize database queries",
							duration: "23:35",
							type: "$A",
							tags: ["3456", "7890"]
						},
						{
							id: "4",
							description: "Review and clarify new feature requirements with the client",
							duration: "01:35",
							type: "$E",
							tags: ["4567", "8901"],
							url: "https://docs.google.com/document/d/123"
						},
						{
							id: "5",
							description: "Update API documentation with new endpoints and examples",
							duration: "03:35",
							type: "$O",
							tags: ["5678", "9012"],
							url: "https://confluence.company.com/api-docs"
						}
					]
				},
				{
					date: new Date(Date.now() + 86400000),
					title: "Day 2",
					activities: [
						{
							id: "6",
							description: "Daily sync with the development team to discuss progress and blockers",
							duration: "19:35",
							type: "$R",
							tags: ["1234", "5678"]
						},
						{
							id: "7",
							description: "Implement new user authentication flow",
							duration: "21:35",
							type: "$D",
							tags: ["2345", "6789"]
						},
						{
							id: "8",
							description: "Analyze and optimize database queries",
							duration: "23:35",
							type: "$A",
							tags: ["3456", "7890"]
						}
					]
				},
				{
					date: new Date(Date.now() + 2 * 86400000),
					title: "Day 3",
					activities: [
						{
							id: "9",
							description: "Daily sync with the development team to discuss progress and blockers",
							duration: "19:35",
							type: "$R",
							tags: ["1234", "5678"]
						},
						{
							id: "10",
							description: "Implement new user authentication flow",
							duration: "21:35",
							type: "$D",
							tags: ["2345", "6789"]
						},
						{
							id: "11",
							description: "Analyze and optimize database queries",
							duration: "23:35",
							type: "$A",
							tags: ["3456", "7890"]
						}
					]
				},
				{
					date: new Date(Date.now() + 3 * 86400000),
					title: "Day 4",
					activities: [
						{
							id: "12",
							description: "Daily sync with the development team to discuss progress and blockers",
							duration: "19:35",
							type: "$R",
							tags: ["1234", "5678"]
						},
						{
							id: "13",
							description: "Implement new user authentication flow",
							duration: "21:35",
							type: "$D",
							tags: ["2345", "6789"]
						},
						{
							id: "14",
							description: "Analyze and optimize database queries",
							duration: "23:35",
							type: "$A",
							tags: ["3456", "7890"]
						}
					]
				},
				{
					date: new Date(Date.now() + 4 * 86400000),
					title: "Day 5",
					activities: [
						{
							id: "15",
							description: "Daily sync with the development team to discuss progress and blockers",
							duration: "19:35",
							type: "$R",
							tags: ["1234", "5678"]
						},
						{
							id: "16",
							description: "Implement new user authentication flow",
							duration: "21:35",
							type: "$D",
							tags: ["2345", "6789"]
						},
						{
							id: "17",
							description: "Analyze and optimize database queries",
							duration: "23:35",
							type: "$A",
							tags: ["3456", "7890"]
						}
					]
				}
			]
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

