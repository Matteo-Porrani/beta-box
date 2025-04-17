/**
 * HydrationSrv is a singleton responsible for hydrating reference IDs
 * in objects into full nested entity objects (e.g., from a Task with a `status` ID
 * to a Task with a nested `status` object).
 *
 * It detects which keys need to be hydrated by checking if they match known
 * entity names (table names), retrieved dynamically via EntitySrv.
 */


import EntitySrv from "@/modules/core/services/EntitySrv";


class HydrationSrv {
	static #instance = null;
	
	/** @type {string[] | null} Cache of known entity types (in lowercase) */
	#entityTypesCache = null;
	
	#entityDesc = null;
	
	constructor() {
		if (HydrationSrv.#instance) {
			throw new Error("Use HydrationSrv.getInstance() to access the singleton instance.");
		}
	}
	
	/**
	 * Returns the singleton instance of HydrationSrv.
	 * @returns {HydrationSrv}
	 */
	static getInstance() {
		if (!HydrationSrv.#instance) {
			HydrationSrv.#instance = new HydrationSrv();
		}
		return HydrationSrv.#instance;
	}
	
	// =============================================
	
	/**
	 * Hydrates an object by replacing foreign key IDs with nested entity objects,
	 * based on detected keys that match known entity types.
	 *
	 * This method recursively hydrates entities at multiple levels.
	 *
	 * @param {Object} obj - The flat object to hydrate (e.g., a Task with status ID).
	 * @param {Object[]} desc -
	 * @returns {Object} The fully hydrated object with nested entity data.
	 */
	hydrateObject(obj, desc) {
		if (Array.isArray(desc)) this.#initEntityDesc(desc);
		
		let result = { ...obj };

		for (const [key, value] of Object.entries(obj)) {
			if (!this.#shouldHydrate(key)) continue;
			
			result = this.#entityDesc[key]
					? this.#hydrateMultiple(result, key, value)
					: this.#hydrateSingle(result, key, value);
		}
		
		return result;
	}
	
	#initEntityDesc(desc) {
		this.#entityDesc = desc.filter(f => f.type === "E").reduce((a, f) => {
			a[f.field] = f.multiple
			return a;
		}, {});
	}
	
	#hydrateSingle(result, key, value) {
		const entityList = this.#getEntityTable(key);
		if (!Array.isArray(entityList)) return;
		
		const entity = entityList.find(item => item.id === Number(value));
		if (entity) {
			// Recursively hydrate the nested entity
			result[key] = this.hydrateObject(entity, this.#entityDesc);
		}
		return result;
	}
	
	#hydrateMultiple(result, key, value) {
		const ids = value.split(":");

		const entityList = this.#getEntityTable(key.toLowerCase());
		if (!Array.isArray(entityList)) return;
		
		result[key] = []

		for (const id of ids) {
			const entity = entityList.find(item => item.id === Number(id));
			if (entity) {
				// Recursively hydrate the nested entity
				result[key].push(this.hydrateObject(entity, this.#entityDesc));
			}
		}
		
		return result;
	}
	
	#shouldHydrate(key) {
		return this.#getEntityTypes().includes(key.toLowerCase());
	}
	
	/**
	 * Retrieves and caches the list of known entity types
	 *
	 * @returns {string[]} Array of entity type names in lowercase.
	 */
	#getEntityTypes() {
		if (!this.#entityTypesCache) {
			this.#entityTypesCache = EntitySrv.getEntityTypes(); // e.g., ['task', 'status', 'color']
		}
		return this.#entityTypesCache;
	}
	
	/**
	 * Retrieves the list of entities (table data) for a given entity type.
	 *
	 * @param {string} tableName - Entity type name (e.g., 'status', 'color').
	 * @returns {Object[]} Array of flat entity objects.
	 */
	#getEntityTable(tableName) {
		return EntitySrv.getItems(tableName);
	}
}


export default HydrationSrv.getInstance();

