const DefaultModule = () => import("../DefaultModule.vue"); // the wrapper module
const TaskHome = () => import("./views/TaskHome.vue");
const TaskDetail = () => import("./views/TaskDetail.vue");

const moduleRoute = {
	path: "/tasks",
	component: DefaultModule,

	children: [
		{
			name: "task_home",
			path: "", // "/tasks"
			component: TaskHome
		},
		
		{
			name: "task_detail",
			path: "detail/:taskId", // "/tasks/detail/3"
			component: TaskDetail
		},
		
	]
};

export default router => {
	router.addRoute(moduleRoute);
};
