import store from "@/store";

class EntitySrv {
	
	static #instance;
	
	static getInstance() {
		if (!EntitySrv.#instance) {
			EntitySrv.#instance = new EntitySrv();
		}
		
		return EntitySrv.#instance;
	}
	
	getItems(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName);
	}
	
	getEntityTypes() {
		return store.getters["entity/getListOptions"]("$entities").map(o => o.value);
	}
	
}

export default EntitySrv.getInstance();

