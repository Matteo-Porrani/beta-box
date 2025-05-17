import EntitySrv from "@/modules/core/services/EntitySrv";



class SprintSrv {
	
	static #instance;
	
	static getInstance() {
		if (!SprintSrv.#instance) {
			SprintSrv.#instance = new SprintSrv();
		}
		return SprintSrv.#instance;
	}
	
	// =============================================
	
	getHydratedSprints() {
		return this.#getSprints();
	}
	
	// =============================================
	
	
	
	#getSprints() {
		return this.#getItems("sprint");
	}
	
	#getItems(tableName) {
		return EntitySrv.getItems(tableName);
	}
	
}


export default SprintSrv.getInstance();

