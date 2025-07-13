const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const ActivityView = () => import("./views/ActivityView.vue");
const CalendarManager = () => import("./views/CalendarManager.vue");
const SprintManager = () => import("./views/SprintManager.vue");
const DailySpeechBoard = () => import("./views/DailySpeechBoard.vue");

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
		{
			name: "activity_daily_speech",
			path: "daily-speech/:dayId/:dayDate",
			component: DailySpeechBoard,
		},
		
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
