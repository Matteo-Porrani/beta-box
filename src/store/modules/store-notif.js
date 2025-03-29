export default {
	
	namespaced: true,
	
	state: () => {
		return {
			currNotif: null,
			notifStack: [],
		}
	},
	
	mutations: {
		SET_CURR_NOTIF(state, value) {
			state.currNotif = value;
		},
		
		PUSH_NOTIF(state, notif) {
			state.notifStack.push(notif)
		},
		
		NOTIF_TIMEOUT(state, notif) {
			setTimeout(() => {
				console.log(`removing ${notif.id}`)
				state.notifStack.filter(n => n.id !== notif.id);
				console.log(`notif ${notif.id} removed`)
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

