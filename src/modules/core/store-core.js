export default {
	
	namespaced: true,
	
	state: () => {
		return {
			coreKey: 1,
		}
	},
	
	mutations: {
		INCREMENT_KEY(state) {
			state.coreKey++
		}
	},
	
	actions: {

	}
	
}

