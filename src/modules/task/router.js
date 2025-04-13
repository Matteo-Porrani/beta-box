const ModuleTask = () => import("./ModuleTask.vue"); // the wrapper module
const TaskHome = () => import("./views/TaskHome.vue");	
const TaskDetail = () => import("./views/TaskDetail.vue");

const moduleRoute = {
	path: "/tasks",
	component: ModuleTask,
	children: [
		{
			path: "/",
			component: TaskHome
		},
		
		{
			path: "detail/:taskId",
			component: TaskDetail
		},
		
	]
};

export default router => {
	router.addRoute(moduleRoute);
};
