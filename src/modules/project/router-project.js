const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const ProjectView = () => import("./views/ProjectView.vue");
const TicketView = () => import("./views/TicketView.vue");
const TicketDetailActivity = () => import("./views/children/TicketDetailActivity.vue");
const TicketDetailNotes = () => import("./views/children/TicketDetailNotes.vue");
const TicketDetailImages = () => import("./views/children/TicketDetailImages.vue");

const moduleRoute = {
	path: "/project",
	component: DefaultModule,
	
	children: [
		{
			name: "project_root",
			path: "",
			component: ProjectView,
		},
		{
			name: "ticket_detail",
			path: "detail/:id",
			component: TicketView,
			children: [
				{
					name: "ticket_detail_notes",
					path: "notes",
					component: TicketDetailNotes,
				},
				{
					name: "ticket_detail_images",
					path: "images",
					component: TicketDetailImages,
				},
				{
					name: "ticket_detail_activity",
					path: "activity",
					component: TicketDetailActivity,
				},
			]
		}
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
