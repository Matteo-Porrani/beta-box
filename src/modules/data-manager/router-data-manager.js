const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module

const DataManagerView = () => import("./views/DataManagerView.vue");

const moduleRoute = {
	path: "/data-manager",
	component: DefaultModule,
	
	children: [
		{
			name: "data_manager_root",
			path: "",
			component: DataManagerView,
		}
	]
}

export default router => {
	router.addRoute(moduleRoute);
};
