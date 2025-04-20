import { isInteger } from "@/modules/core/utils/core-utils";
import { prepareItem } from "@/modules/admin/utils/entity-utils";

class NotesSrv {
	
	static #instance;
	
	static getInstance() {
		if (!NotesSrv.#instance) {
			NotesSrv.#instance = new NotesSrv();
		}
		return NotesSrv.#instance;
	}

	async saveNote(data) {
		console.log("SRV - saveNote", data)
		
		const action = isInteger(data.id)
			? "updateItem"
			: "addItem"
		
		await this[action]({
			tableName: "note",
			item: prepareItem(data)
		})
	}
}


export default NotesSrv.getInstance();

