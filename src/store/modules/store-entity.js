import { dataSrv } from "@/service/DataSrv";
import { DatabaseActionResponse } from "@/types/DatabaseActionResponse";

export default {
	namespaced: true,
	
	state: () => {
		return {
			loading: false,
			entities: {},
		}
	},
	
	mutations: {
		SET_LOADING(state, loading) {
			state.loading = loading
		},
		
		SET_ITEMS(state, { tableName, items }) {
			state.entities[tableName] = items;
		},
	},
	
	actions: {
		
		/**
		 * This is the try...catch wrapper
		 * @param commit
		 * @param action
		 * @returns {Promise<{result: string, message}|*>}
		 */
		async execDatabaseAction({ commit }, action) {
			commit('SET_LOADING', true);
			try {
				return await action();
			} catch (e) {
				console.error(e)
				return {
					result: "ERR",
					message: e.message
				}
			} finally {
				commit('SET_LOADING', false)
			}
		},
		
		async loadItems({ dispatch, commit }, tableName) {
			return await dispatch("execDatabaseAction", async () => {
				const items = await dataSrv.load(tableName);
				commit('SET_ITEMS', { tableName, items });
				return new DatabaseActionResponse(true, "items successfully loaded");
			});
		},
		
		async addItem({ dispatch }, { tableName, newItem }) {
			console.log(JSON.stringify(newItem))
			return await dispatch("execDatabaseAction", async () => {
				const id = await dataSrv.add(tableName, newItem);
				// reload
				await dispatch("loadItems", tableName);
				return new DatabaseActionResponse(true, `item ${id} added`);
			});
		},
		
	}
	
}

