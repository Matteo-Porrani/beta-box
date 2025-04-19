import store from "@/store";
import EntitySrv from "@/modules/core/services/EntitySrv";

class TableSrv {
	
	static #instance;
	
	static getInstance() {
		if (!TableSrv.#instance) {
			TableSrv.#instance = new TableSrv();
		}
		return TableSrv.#instance;
	}
	
	// ...
	
	getListLabels(rows, entityName) {
		const listDictionary = EntitySrv.getEntityListDictionary(entityName);
		return Object.keys(listDictionary).length > 0
			? rows.map(row => this._getLabelsForRow(row, listDictionary))
			: rows;
	}
	
	_getLabelsForRow(row, listDictionary) {
		for (const k of Object.keys(listDictionary)) {
			const code = row[k];
			// const label = this.getLabelFromListValue(listDictionary[k], row[k]);
			const label = store.getters["entity/getLabelFromListValue"](listDictionary[k], row[k])
			row[k] = `[${code}] ${label}`;
		}
		return row;
	}
}


export default TableSrv.getInstance();

