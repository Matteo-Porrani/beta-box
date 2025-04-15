const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const ProjectView = () => import("./views/ProjectView.vue");

const moduleRoute = {
	path: "/project",
	component: DefaultModule,
	
	children: [
		{
			name: "project_root",
			path: "",
			component: ProjectView,
		}
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
