/*

This service is responsible for writing & querying IndexedDB
through Dexie API.

 */


import { db } from "@/service/db";

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
}

export const dataSrv = DataSrv.getInstance();

