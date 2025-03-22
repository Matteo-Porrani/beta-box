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
	
	
	async add(tableName, item) {
		console.log(`%c${"add"}`, "background: gold; color: black; padding: 2px;")
		return this.api[tableName].add(item);
	}
	
	async delete(tableName, id) {
		console.log(`%c${"delete" + tableName + "/" + id}`, "background: crimson; color: black; padding: 2px;")
		return this.api[tableName].delete(id);
	}
	
	async clear(tableName) {
		console.log(`%c${"clear"}`, "background: crimson; color: black; padding: 2px;")
		return this.api[tableName].clear();
	}
	
	/* =============================================
		UTILITIES
		============================================= */
	
	async count(tableName) {
		console.log(`%c${"count"}`, "background: blue; color: black; padding: 2px;")
		return this.api[tableName].count();
	}
}

export const dataSrv = DataSrv.getInstance();

