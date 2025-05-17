const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const ActivityView = () => import("./views/ActivityView.vue");
const CalendarManager = () => import("./views/CalendarManager.vue");

const moduleRoute = {
	path: "/activity",
	component: DefaultModule,
	
	children: [
		{
			name: "activity_root",
			path: "",
			component: ActivityView,
		},
		{
			name: "activity_calendar_manager",
			path: "",
			component: CalendarManager,
		},
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
