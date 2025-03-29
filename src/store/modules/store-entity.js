import { dataSrv } from "@/service/DataSrv";
import { DatabaseActionResponse } from "@/types/DatabaseActionResponse";
import { pascalToSnake, snakeToPascal } from "@/utils/core-utils";

export default {
	namespaced: true,
	
	state: () => {
		return {
			loading: false,
			entities: {},
		}
	},
	
	getters: {
		getList: (state) => {
			return (listCode) => {
				console.log("/// getList", listCode)
				return state.entities.list_option
					.filter(el => el.list === listCode)
					.sort((a, b) => a.order - b.order)
					.map(el => ({
						value: el.code,
						label: el.label,
						default: el.default
					}));
			}
		},
		
		getEntityDescription: (state) => {
			return (entityName) => {
				const en = snakeToPascal(entityName);
				console.log("/// get description", en)
				return state.entities.field_definition
					.filter(el => el.entity === en)
					.sort((a, b) => a.order - b.order);
			}
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
		
		/**
		 * ADD
		 * @param dispatch
		 * @param tableName
		 * @param item
		 * @param newItem
		 * @returns {Promise<*>}
		 */
		async addItem({ dispatch }, { tableName, item }) {
			console.log(JSON.stringify(item))
			return await dispatch("execDatabaseAction", async () => {
				const id = await dataSrv.add(tableName, item);
				// reload
				await dispatch("loadItems", tableName);
				return new DatabaseActionResponse(true, `item ${id} added`);
			});
		},
		
		/**
		 * UPDATE
		 * @param dispatch
		 * @param tableName
		 * @param item
		 * @returns {Promise<*>}
		 */
		async updateItem({ dispatch }, { tableName, item }) {
			console.log(JSON.stringify(item))
			return await dispatch("execDatabaseAction", async () => {
				await dataSrv.update(tableName, item);
				// reload
				await dispatch("loadItems", tableName);
				return new DatabaseActionResponse(true, `item ${item.id} successfully updated`);
			});
		},
		
		/**
		 * DELETE & CLEAR
		 * @param dispatch
		 * @param tableName
		 * @param id
		 * @param all
		 * @returns {Promise<*>}
		 */
		async deleteItem({ dispatch }, { tableName, id, all = false }) {
			return await dispatch("execDatabaseAction", async () => {
				const m = (!id && all)
					? "clear"
					: "delete";

				await dataSrv[m](tableName, id);
				// reload
				await dispatch("loadItems", tableName);
				return new DatabaseActionResponse(true, `item #${id} deleted`);
			});
		},
	}
	
}

