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
	
	getItems(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName);
	}
	
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
	
	getEntityTypes() {
		return store.getters["entity/getListOptions"]("$entities").map(o => o.value);
	}
	
	getEntityDescription(snakeCaseEntityName) {
		return store.getters["entity/getEntityDescription"](snakeCaseEntityName);
	}
	
	/**
	 * Takes the (pascal case) entity name as input param (eg : "Ticket", "FieldDefinition"),
	 * and returns a dictionary with the fields of type "L" found in the entity description
	 * @param pascalCaseEntityName
	 * @returns {*}
	 */
	getEntityListDictionary(pascalCaseEntityName) {
		const d = this.getEntityDescription(pascalToSnake(pascalCaseEntityName));
		return d.filter(f => f.type === "L")
			.reduce((a, f) => {
				a[f.field] = f.list
				return a;
			}, {});
	}
	
}

export default EntitySrv.getInstance();

