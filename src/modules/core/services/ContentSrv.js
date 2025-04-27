import store from "@/store";

import EntitySrv from "@/modules/core/services/EntitySrv";

/**
 * Service for managing content items, particularly focused on handling image content.
 * Implements the Singleton pattern to ensure only one instance exists.
 * This service works in conjunction with the Vuex store and EntitySrv for data management.
 */
class ContentSrv {
	
	/** @private */
	static #instance;
	
	/**
	 * Gets the singleton instance of ContentSrv
	 * @returns {ContentSrv} The singleton instance
	 */
	static getInstance() {
		if (!ContentSrv.#instance) {
			ContentSrv.#instance = new ContentSrv();
		}
		return ContentSrv.#instance;
	}
	
	// =============================================

	/**
	 * Retrieves all content items and converts their data to data URLs
	 * @returns {Promise<Array<Object>>} A promise that resolves to an array of content items with data URLs
	 * @async
	 */
	async getContentItems() {
		// Load content items from store
		await store.dispatch("entity/loadItems", "content")
		
		const items = this._getItems();
		
		// Convert base64 data to data URLs for each item
		for (const i of items) {
			i.dataUrl = `data:image/png;base64,${i.data}`
		}
		
		return items;
	}
	
	/**
	 * Deletes a content item by its ID
	 * @param {string|number} id - The ID of the content item to delete
	 * @returns {Promise<void>}
	 * @async
	 */
	async deleteItem(id) {
		await store.dispatch("entity/deleteItem", { tableName: "content", id })
	}
	
	// =============================================
	
	/**
	 * Retrieves content items from EntitySrv
	 * @private
	 * @param {string} tableName - The name of the table to get items from
	 * @returns {Array<Object>} An array of content items
	 */
	_getItems() {
		return EntitySrv.getItems("content");
	}
	
	// =============================================
	
}

export default ContentSrv.getInstance();

