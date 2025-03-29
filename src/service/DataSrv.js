/*

This service is responsible for writing & querying IndexedDB
through Dexie API.

 */

// I need to import store

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
		console.log(`%c${"load/" + tableName}`, "background: turquoise; color: black; padding: 2px;")
		this.showNotif("SUCCESS", `table "${tableName}" loaded`);
		return this.api[tableName].orderBy('id').toArray();
	}
	
	async add(tableName, item) {
		console.log(`%c${"add/" + tableName}`, "background: gold; color: black; padding: 2px;")
		return this.api[tableName].add(item);
	}
	
	async update(tableName, item) {
		console.log(`%c${"update/" + tableName}`, "background: gold; color: black; padding: 2px;")
		return this.api[tableName].update(item.id, item);
	}
	
	async delete(tableName, id) {
		console.log(`%c${"delete/" + tableName + "/" + id}`, "background: crimson; color: black; padding: 2px;")
		return this.api[tableName].delete(id);
	}
	
	async clear(tableName) {
		console.log(`%c${"clear/" + tableName}`, "background: crimson; color: black; padding: 2px;")
		return this.api[tableName].clear();
	}
	
	// =============================================
	// UTILITIES
	// =============================================
	
	async count(tableName) {
		console.log(`%c${"count"}`, "background: blue; color: black; padding: 2px;")
		return this.api[tableName].count();
	}
	
	showNotif(status, message) {
		const n = new AppNotification(status, message);
		// call mutation SET_CURR_NOTIF in 'notif' store
		store.dispatch('notif/showNotif', n)
	}
}

export const dataSrv = DataSrv.getInstance();

