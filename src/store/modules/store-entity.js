import { dataSrv } from "@/service/DataSrv";
import { DatabaseActionResponse } from "@/types/DatabaseActionResponse";
import { nrm, pascalToSnake, snakeToPascal } from "@/utils/core-utils";

export default {
	namespaced: true,
	
	state: () => {
		return {
			loading: false,
			entities: {},
		}
	},
	
	getters: {
		getListOptions: (state) => {
			return (listCode) => {
				console.log("/// getListOptions", listCode)
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
		
		getEntityDescription: (state, getters) => {
			return (entityName) => {
				const en = snakeToPascal(entityName);
				console.log("/// get description", en)
				
				const orderedFields = getters._getOrderedFields(en);
				const fieldsWithListOpts = getters._getOptionsForListFields(orderedFields);
				const fieldsWithEntPickerOpts = getters._getOptionsForEntityPickerFields(fieldsWithListOpts);

				return nrm(fieldsWithEntPickerOpts);
			}
		},
		
		_getOrderedFields: (state) => {
			return (en) => {
				return state.entities.field_definition
					.filter(el => el.entity === en)
					.sort((a, b) => a.order - b.order);
			}
		},
		
		_getOptionsForListFields: (state, getters) => {
			return (fields) => {
				for (const f of fields) {
					if (f.type === "L" && f.list) f.options = getters.getListOptions(f.list);
				}
				
				return fields;
			}
		},
		
		_getOptionsForEntityPickerFields: (state, getters) => {
			return (fields) => {
				for (const f of fields) {
					if (f.type === "E" && f.rel_entity) {
						console.log(f.field, f.rel_entity)
						
						const cols = getters._getPickerCols(f.rel_entity);
						console.log("[picker_cols]", cols)
						const rows = state.entities[pascalToSnake(f.rel_entity)];
						
						f.options = rows.map(r => {
							const o = {};
							for (const k of cols) {
								o[k] = r[k];
							}
							return o;
						})
						f.entityPickerCols = cols;
					}
				}
				
				return fields;
			}
		},
		
		// @return String[]
		_getPickerCols: (state, getters) => {
			return (entityName) => {
				const d = getters.getEntityDescription(entityName);
				return d.filter(f => f.picker_col === true).map(f => f.field);
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

