/**
 * HydrationSrv is a singleton responsible for hydrating reference IDs
 * in objects into full nested entity objects (e.g., from a Task with a `status` ID
 * to a Task with a nested `status` object).
 *
 * It detects which keys need to be hydrated by checking if they match known
 * entity names (table names), retrieved dynamically via EntityService.
 */
class HydrationSrv {
	static #instance = null;
	
	/** @type {string[] | null} Cache of known entity types (in lowercase) */
	#entityTypesCache = null;
	
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
	
	/**
	 * Hydrates an object by replacing foreign key IDs with nested entity objects,
	 * based on detected keys that match known entity types.
	 *
	 * This method recursively hydrates entities at multiple levels.
	 *
	 * @param {Object} obj - The flat object to hydrate (e.g., a Task with status ID).
	 * @returns {Object} The fully hydrated object with nested entity data.
	 */
	hydrateObject(obj) {
		const result = { ...obj };
		const entityTypes = this.#getEntityTypes();
		
		for (const [key, value] of Object.entries(obj)) {
			if (!this.#shouldHydrate(key, value)) continue;
			
			const entityList = this.#getEntityTable(key.toLowerCase());
			if (!Array.isArray(entityList)) continue;
			
			const entity = entityList.find(item => item.id === value);
			if (entity) {
				// Recursively hydrate the nested entity
				result[key] = this.hydrateObject(entity);
			}
		}
		
		return result;
	}
	
	/**
	 * Determines if a key/value pair should be hydrated.
	 * Hydration is applied if:
	 * - The value is a number (assumed to be an ID)
	 * - The key matches one of the known entity types (case-insensitive)
	 *
	 * @param {string} key - Object key to test (e.g., 'status', 'project').
	 * @param {*} value - The value to test (expected to be a numeric ID).
	 * @returns {boolean} Whether the key should be hydrated.
	 */
	#shouldHydrate(key, value) {
		const entityTypes = this.#getEntityTypes();
		return (
			typeof value === 'number' &&
			entityTypes.includes(key.toLowerCase())
		);
	}
	
	/**
	 * Retrieves and caches the list of known entity types
	 * using EntityService.getEntityTypes().
	 *
	 * @returns {string[]} Array of entity type names in lowercase.
	 */
	#getEntityTypes() {
		if (!this.#entityTypesCache) {
			const types = EntityService.getEntityTypes(); // e.g., ['Task', 'Status', 'Color']
			this.#entityTypesCache = types.map(type => type.toLowerCase());
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
		return EntityService.getItems(tableName);
	}
}

