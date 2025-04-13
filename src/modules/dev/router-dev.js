const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const DevView = () => import("./views/DevView.vue");

const moduleRoute = {
	path: "/dev",
	component: DefaultModule,
	
	children: [
		{
			name: "dev_root",
			path: "",
			component: DevView,
		}
	]
}

export default router => {
	router.addRoute(moduleRoute);
};

