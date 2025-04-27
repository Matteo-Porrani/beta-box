import store from "@/store";

import EntitySrv from "@/modules/core/services/EntitySrv";


class ContentSrv {
	
	static #instance;
	
	static getInstance() {
		if (!ContentSrv.#instance) {
			ContentSrv.#instance = new ContentSrv();
		}
		return ContentSrv.#instance;
	}

	// ...
	
	
	async getContentItems() {
		// load in store
		await store.dispatch("entity/loadItems", "content")
		
		const items = this._getItems();
		
		console.log("/// getContentItems COUNT:", items.length)
		
		for (const i of items) {
			console.log("name", i.name)
			
			i.dataUrl = `data:image/png;base64,${i.data}`
		}
		
		return items;
	}
	
	// =============================================
	
	
	_getItems() {
		return EntitySrv.getItems("content");
	}
	
	// =============================================
	
}


export default ContentSrv.getInstance();

