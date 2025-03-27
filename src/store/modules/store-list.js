
export default {
	
	namespaced: true,
	
	state: () => {
		return {
			lists: {
				$cities: [
					{ value: null, label: "Pick a city" }, // null value is the default
					{ value: "P", label: "Paris" },
					{ value: "M", label: "Milan" },
					{ value: "R", label: "Rome" },
				]
			}
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
