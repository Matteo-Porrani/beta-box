export default {
	namespaced: true,
	
	state: () => {
		return {
			tasks: [],
			taskCount: 1
		}
	},
	
	mutations: {
		SET_TASK_COUNT(state, value) {
			state.taskCount += state.taskCount;
		}
	}
}
