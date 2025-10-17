const DefaultModule = () => import("../DefaultModule.vue");

const TimeToolsView = () => import("./views/TimeToolsView.vue");

const moduleRoute = {
	path: "/time-tools",
	component: DefaultModule,

	children: [
		{
			name: "time_tools_root",
			path: "",
			component: TimeToolsView,
		},
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
