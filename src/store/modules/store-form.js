
export default {
	
	namespaced: true,
	
	state: () => {
		return {
			formValues: {}
		}
	},
	
	getters: {},
	
	mutations: {
		
		SET_FIELD(state, { key, value }) {
			console.log("🟡 SET", key, value)
			state.formValues[key] = value;
		},
		
		RESET_FORM(state) {
			state.formValues = {};
		}
	},
	
	actions: {},
	
}
