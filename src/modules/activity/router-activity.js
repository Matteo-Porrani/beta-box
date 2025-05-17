const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const ActivityView = () => import("./views/ActivityView.vue");
const CalendarManager = () => import("./views/CalendarManager.vue");
const SprintManager = () => import("./views/SprintManager.vue");

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
			path: "calendar-manager",
			component: CalendarManager,
		},
		{
			name: "activity_sprint_manager",
			path: "sprint-manager",
			component: SprintManager,
		},
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
