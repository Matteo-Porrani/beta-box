const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const ProjectView = () => import("./views/ProjectView.vue");
const TicketDetailView = () => import("./views/TicketDetailView.vue");

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
			component: TicketDetailView,
		}
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
