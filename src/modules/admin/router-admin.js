const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const AdminView = () => import("./views/AdminView.vue");

const moduleRoute = {
	path: "/admin",
	component: DefaultModule,
	
	children: [
		{
			name: "admin_root",
			path: "",
			component: AdminView,
		}
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
