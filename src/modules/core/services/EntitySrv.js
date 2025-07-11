/*

The `EntitySrv` is meant to simplify reading operations from store-entity.
	- most of the exposed methods are direct façade for store-entity getters (is this a good idea ?)
	- getListFieldsDictionary() is a helper that offers additional functionality built on getters
	- logEntityFieldDefs() is a debug helper

 */


import store from "@/store";
import { pascalToSnake } from "@/modules/core/utils/core-utils";
import { sortRows } from "@/modules/core/utils/table-utils";

class EntitySrv {
	
	static #instance;
	
	static getInstance() {
		if (!EntitySrv.#instance) {
			EntitySrv.#instance = new EntitySrv();
		}
		
		return EntitySrv.#instance;
	}
	
	// ============================================= READ DATA
	
	/**
	 * @param {string} tableName
	 * @returns {Array<object>}
	 */
	getItems(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName);
	}
	
	getItemsCount(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName).length;
	}
	
	getItemById(tableName, id) {
		const items = this.getItems(tableName);
		return items.find(i => Number(i.id) === Number(id))
	}
	
	// ============================================= SECTION
	
	getListOfEntities() {
		return store.getters["entity/getListItemsByListCode"]("$entities").map(o => o.value);
	}
	
	getEntityDescription(snakeCaseEntityName) {
		return store.getters["entity/getEntityDescription"](snakeCaseEntityName);
	}
	
	/**
	 * Takes the (pascal case) entity name as input param (eg : "Ticket", "FieldDefinition"),
	 * and returns a dictionary with the fields of type "L" found in the entity description
	 * @param {string} pascalCaseEntityName
	 * @returns {object}
	 *
	 * @example - for Ticket entity, 2 fields are of type "L" and their linked to $team & $phase lists
	 * {
	 *     "team": "$team",
	 *     "phase": "$phase"
	 * }
	 */
	getListFieldsDictionary(pascalCaseEntityName) {
		const d = this.getEntityDescription(pascalToSnake(pascalCaseEntityName));

		/*
		filter(f => f.type === "L") keeps only items with type "L".
		map(f => [f.field, f.list]) creates key-value pairs.
		Object.fromEntries(...) converts those pairs into an object.
		 */
		return Object.fromEntries(
			d.filter(f => f.type === "L").map(f => [f.field, f.list])
		);
		
	}
	
	// ============================================= DEBUG
	
	logEntityFieldDefs() {
		const fds = store.getters["entity/getItemsFromTable"]("field_definition")
		
		const rows = []
		
		for (const r of fds) {
			const o = {};
			[
				"id",
				"entity",
				"order",
				"field",
				"type",
				"pk",
				"list",
				"rel_entity",
				"multiple",
				"min",
				"max",
				"readonly",
				"picker_col",
				"filter",
				"info",
				"comment",
				"required",
			].forEach(k => {
				o[k] = "-";
				o[k] = r[k] ?? "-"
			})
			rows.push(o)
		}
		
		sortRows(rows, "entity", true)
	}
	
}

export default EntitySrv.getInstance();

