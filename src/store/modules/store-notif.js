export default {
	
	namespaced: true,
	
	state: () => {
		return {
			notifStack: [],
		}
	},
	
	mutations: {
		PUSH_NOTIF(state, notif) {
			state.notifStack.push(notif)
		},
		
		NOTIF_TIMEOUT(state, notif) {
			setTimeout(() => {
				state.notifStack = state.notifStack.filter(n => n.id !== notif.id);
			}, notif.duration)
		}
	},
	
	actions: {
		showNotif({ commit }, notif) {
			commit("PUSH_NOTIF", notif);
			commit("NOTIF_TIMEOUT", notif)
		}
	}
	
}

