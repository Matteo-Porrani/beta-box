
export default {
	
	namespaced: true,
	
	state: () => {
		return {
			lists: {}
		}
	},
	
	getters: {
		getList: (state) => {
			return (listCode) => {
				return state.lists[listCode] ?? [];
			}
		}
	},
	
	mutations: {},
	
	actions: {},
	
}
