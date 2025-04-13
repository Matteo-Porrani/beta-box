export default {
	namespaced: true,
	
	state: () => {
		return {
			tasks: [],
			taskCount: 1
		}
	},
	
	mutations: {
		INCREMENT_COUNT(state) {
			state.taskCount += 1;
		}
	}
}
