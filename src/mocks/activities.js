export const mockDays = [
	{
		date: new Date(),
		title: "MON",
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
		]
	},
	{
		date: new Date(Date.now() + 86400000),
		title: "Day 2",
		activities: [
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
		date: new Date(Date.now() + 2 * 86400000),
		title: "Day 3",
		activities: []
	},
	{
		date: new Date(Date.now() + 3 * 86400000),
		title: "Day 4",
		activities: []
	},
	{
		date: new Date(Date.now() + 4 * 86400000),
		title: "Day 5",
		activities: []
	}
]; 