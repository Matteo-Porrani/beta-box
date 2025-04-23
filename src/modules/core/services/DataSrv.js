/*

This service is responsible for writing & querying IndexedDB
through Dexie API.

 */

// Vue related
import store from '@/store/index.js'
// data
import { db } from "@/data/db";
// types
import { AppNotification } from "@/types/AppNotification";


class DataSrv {

	static instance;
	
	constructor() {
		this.api = db;
	}
	
	static getInstance() {
		if (!DataSrv.instance) {
			DataSrv.instance = new DataSrv();
		}
		
		return DataSrv.instance;
	}

// =============================================
// CRUD
// =============================================
	
	async load(tableName) {
		// console.log(`%c${"load/" + tableName}`, "background: turquoise; color: black; padding: 2px;")
		const items = await this.api[tableName].orderBy('id').toArray();
		this.showNotif("SUCCESS", `Table "${tableName}" loaded`);
		return items;
	}
	
	async add(tableName, item) {
		console.log(`%c${"add/" + tableName}`, "background: gold; color: black; padding: 2px;")
		const newId = await this.api[tableName].add(item)
		this.showNotif("SUCCESS", `New item #${newId} added in table [${tableName}]`);
		return newId;
	}
	
	async update(tableName, item) {
		console.log(`%c${"update/" + tableName}`, "background: gold; color: black; padding: 2px;")
		const res = await this.api[tableName].update(item.id, item);
		this.showNotif("SUCCESS", `Item #${item.id} updated`);
		return res;
	}
	
	async delete(tableName, id) {
		console.log(`%c${"delete/" + tableName + "/" + id}`, "background: crimson; color: black; padding: 2px;")
		const res = await this.api[tableName].delete(id);
		this.showNotif("SUCCESS", `Item #${id} deleted`);
		return res;
	}
	
	async clear(tableName) {
		console.log(`%c${"clear/" + tableName}`, "background: crimson; color: black; padding: 2px;")
		const res = await this.api[tableName].clear();
		this.showNotif("SUCCESS", `Table has been cleared`);
		return res;
	}
	
	// =============================================
	// UTILITIES
	// =============================================
	
	async count(tableName) {
		console.log(`%c${"count"}`, "background: blue; color: black; padding: 2px;")
		return await this.api[tableName].count();
	}
	
	showNotif(status, message) {
		const n = new AppNotification(status, message);
		store.dispatch('notif/showNotif', n)
	}
}

export const dataSrv = DataSrv.getInstance();

