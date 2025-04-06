
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
				console.log("/// getList", listCode)
				return state.lists[listCode] ?? [];
			}
		}
	},
	
	mutations: {},
	
	actions: {},
	
}
