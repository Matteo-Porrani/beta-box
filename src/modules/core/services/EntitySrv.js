/*

The `EntitySrv` is a core service that acts as a central access point
for entity-related data and metadata in the application.
Its main responsibilities are:

1. **Entity Data Access**
   - Provides methods to retrieve items from different entity tables through `getItems(tableName)`
   - Acts as a facade to the Vuex store's entity module, abstracting away the direct store access

2. **Entity Metadata Management**
   - Retrieves entity descriptions and field definitions through `getEntityDescription(snakeCaseEntityName)`
   - Provides access to entity types through `getEntityTypes()`
   - Offers specialized methods for handling list fields through `getListFieldsDictionary(pascalCaseEntityName)`

3. **Debugging Support**
   - Includes a `logEntityFieldDefs()` method for logging field definitions, which appears to be used for debugging purposes

4. **Integration Point**
   - Serves as a central integration point for other services like:
     - `HydrationSrv` - for transforming flat objects into nested entities
     - `TableSrv` - for handling table-related operations
     - `ProjectSrv` - for project-specific entity operations
     - `ContentSrv` - for content-related entity operations

5. **Data Normalization**
   - Works in conjunction with the Vuex store's entity module to provide normalized data access
   - Handles the conversion between different naming conventions (pascal case to snake case)

The service is designed to be a single source of truth for entity-related operations,
providing a clean interface for other parts of the application
to interact with entity data and metadata.
It's particularly focused on abstracting away the complexity of entity data access
and providing consistent methods for working with different types of entities in the system.

 */


import store from "@/store";
import { pascalToSnake } from "@/modules/core/utils/core-utils";
import { sortRows } from "@/modules/core/utils/table-utils";

class EntitySrv {
	
	static #instance;
	
	static getInstance() {
		if (!EntitySrv.#instance) {
			EntitySrv.#instance = new EntitySrv();
		}
		
		return EntitySrv.#instance;
	}
	
	// ============================================= READ DATA
	
	/**
	 * @param {string} tableName
	 * @returns {Array<object>}
	 */
	getItems(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName);
	}
	
	getItemsCount(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName).length;
	}
	
	getItemById(tableName, id) {
		const items = this.getItems(tableName);
		return items.find(i => Number(i.id) === Number(id))
	}
	
	// ============================================= SECTION
	
	getEntityTypes() {
		return store.getters["entity/getListOptions"]("$entities").map(o => o.value);
	}
	
	getEntityDescription(snakeCaseEntityName) {
		return store.getters["entity/getEntityDescription"](snakeCaseEntityName);
	}
	
	/**
	 * Takes the (pascal case) entity name as input param (eg : "Ticket", "FieldDefinition"),
	 * and returns a dictionary with the fields of type "L" found in the entity description
	 * @param pascalCaseEntityName
	 * @returns {*}
	 */
	getListFieldsDictionary(pascalCaseEntityName) {
		const d = this.getEntityDescription(pascalToSnake(pascalCaseEntityName));
		return d.filter(f => f.type === "L")
			.reduce((a, f) => {
				a[f.field] = f.list
				return a;
			}, {});
	}
	
	// ============================================= DEBUG
	
	logEntityFieldDefs() {
		const fds = store.getters["entity/getItemsFromTable"]("field_definition")
		
		const rows = []
		
		for (const r of fds) {
			const o = {};
			[
				"id",
				"entity",
				"order",
				"field",
				"type",
				"pk",
				"list",
				"rel_entity",
				"multiple",
				"min",
				"max",
				"readonly",
				"picker_col",
				"filter",
				"info",
				"comment",
				"required",
			].forEach(k => {
				o[k] = "-";
				o[k] = r[k] ?? "-"
			})
			rows.push(o)
		}
		
		sortRows(rows, "entity", true)
	}
	
}

export default EntitySrv.getInstance();

