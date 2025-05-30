const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const AdminView = () => import("./views/AdminView.vue");
const ContentView = () => import("./views/ContentView.vue")
const CalendarView = () => import("./views/CalendarView.vue")

const moduleRoute = {
	path: "/admin",
	component: DefaultModule,
	
	children: [
		{
			name: "admin_root",
			path: "", // #/admin
			component: AdminView,
		},
		
		{
			name: "content",
			path: "content", // #/admin/content
			component: ContentView,
		},
		
		{
			name: "calendar",
			path: "calendar", // #/admin/calendar
			component: CalendarView,
		},
		
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
