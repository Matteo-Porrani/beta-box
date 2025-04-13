const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const ActivityView = () => import("./views/ActivityView.vue");

const moduleRoute = {
	path: "/activity",
	component: DefaultModule,
	
	children: [
		{
			name: "activity_root",
			path: "",
			component: ActivityView,
		}
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
