const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const AdminView = () => import("./views/AdminView.vue");
const ContentView = () => import("./views/ContentView.vue")

const moduleRoute = {
	path: "/admin",
	component: DefaultModule,
	
	children: [
		{
			name: "admin_root",
			path: "",
			component: AdminView,
		},
		
		{
			name: "content",
			path: "/content",
			component: ContentView,
		},
		
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
