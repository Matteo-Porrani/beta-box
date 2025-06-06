import store from "@/store";

import { isInteger, nrm } from "@/modules/core/utils/core-utils";
import { prepareItem } from "@/modules/admin/utils/entity-utils";

class NotesSrv {
	
	static #instance;
	
	static getInstance() {
		if (!NotesSrv.#instance) {
			NotesSrv.#instance = new NotesSrv();
		}
		return NotesSrv.#instance;
	}
	
	// =============================================

	getNoteById(id) {
		const n = store.getters["entity/getItemsFromTable"]("note")
			.find(n => Number(n.id) === Number(id))
		return nrm(n);
	}

	// =============================================

	async saveNote(data) {
		const action = isInteger(data.id)
			? "updateItem"
			: "addItem"
		
		await this[action]({
			tableName: "note",
			item: prepareItem(data)
		})
		
		store.commit("core/INCREMENT_KEY");
	}
	
	async addItem(data) {
		await store.dispatch("entity/addItem", data)
	}
	
	async updateItem(data) {
		await store.dispatch("entity/updateItem", data)
	}
	
	
	async deleteNote(id) {
		await store.dispatch("entity/deleteItem", { tableName: "note", id: id })
		store.commit("core/INCREMENT_KEY");
	}
}


export default NotesSrv.getInstance();

