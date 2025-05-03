import store from "@/store";

import EntitySrv from "@/modules/core/services/EntitySrv";
import { exportSrv } from "@/modules/data-manager/services/ExportSrv";

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
		
		const items = this.#getContentItems();
		
		// Convert base64 data to data URLs for each item
		for (const i of items) {
			this.addDataUrlValue(i);
		}
		
		this.#addLinkedProp(items);
		
		return items;
	}
	
	addDataUrlValue(item) {
		item.dataUrl = `data:image/png;base64,${item.data}`;
		item.size = `${(this.#calculateBase64Size(item.data)).toFixed(2)} Kb`;
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
	
	async downloadItem(id) {
		console.log("[ContentSrv] downloadItem", id)
		const image = this.#getContentItemById(id)
		
		if (image) {
			console.log(">>>>", image)
			exportSrv.downloadImage(
				image.data, // data without the prefix 'data:image/png;base64,'
				image.name
			)
		}
		
	}
	
	// =============================================
	
	/**
	 * Retrieves content items from EntitySrv
	 * @private
	 * @param {string} tableName - The name of the table to get items from
	 * @returns {Array<Object>} An array of content items
	 */
	#getContentItems() {
		return EntitySrv.getItems("content");
	}
	
	#getContentItemById(id) {
		return EntitySrv.getItems("content")
			.find(c => Number(c.id) === Number(id));
	}
	
	#getTicketItems() {
		return EntitySrv.getItems("ticket");
	}
	
	/**
	 * Calculates the size of a base64 encoded image in bytes
	 * @param {string} base64String - The base64 encoded image string
	 * @returns {number} The size of the image in bytes
	 */
	#calculateBase64Size(base64String) {
		// Remove the data URL prefix if present
		const base64Data = base64String.includes('base64,') 
			? base64String.split('base64,')[1] 
			: base64String;
			
		// Calculate padding
		const padding = (base64Data.match(/=/g) || []).length;
		
		// Calculate size
		return ((base64Data.length * 3/4) - padding) / 1024; // KB
	}
	
	#addLinkedProp(items) {
		const contents = this.#getTicketItems()
			.map(t => t.content)
			.filter(Boolean); // will remove falsy values from the array
		
		const linkedIds = this.#getLinkedIds(contents);
		
		for (const image of items) {
			image.linked = linkedIds.includes(image.id);
		}
	}
	
	#getLinkedIds(contents) {
		const linkedIds = [];
		for (const c of contents) {
			const ids = c.split(":");
			for (const id of ids) {
				if (!linkedIds.includes(id)) linkedIds.push(Number(id))
			}
		}
		return linkedIds;
	}
	
	// =============================================
	
}

export default ContentSrv.getInstance();

