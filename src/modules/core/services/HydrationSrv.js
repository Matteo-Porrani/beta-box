/**
 * HydrationSrv is a singleton responsible for hydrating reference IDs
 * in objects into full nested entity objects (e.g., from a Task with a `status` ID
 * to a Task with a nested `status` object).
 *
 * It detects which keys need to be hydrated by checking if they match known
 * entity names (table names), retrieved dynamically via EntitySrv.
 */

import EntitySrv from "@/modules/core/services/EntitySrv";
import { pascalToSnake } from "@/modules/core/utils/core-utils";


class HydrationSrv {
	static #instance = null;
	
	/** @type {string[] | null} Cache of known entity types (in lowercase) */
	#entityTypesCache = null;
	#multiplicityMap = null;
	#rootEntityName = null;

	
	static getInstance() {
		if (!HydrationSrv.#instance) {
			HydrationSrv.#instance = new HydrationSrv();
		}
		return HydrationSrv.#instance;
	}

	// =============================================
	
	/**
	 * Hydrates an object by replacing foreign key IDs with nested entity objects,
	 * This method recursively hydrates entities at multiple levels.
	 *
	 * @param {Object} obj - The flat object to hydrate (e.g., a Task with status ID).
	 * @param {Object[]} desc -
	 * @param {Boolean} root -
	 * @returns {Object} The fully hydrated object with nested entity data.
	 */
	hydrateObject(obj, desc, root = true) {
		if (Array.isArray(desc)) this.#initMultiplicityMap(desc);
		
		let result = { ...obj };
		
		// this handles relations owned by the object
		for (const [key, value] of Object.entries(obj)) {
			if (!this.#getEntityTypes().includes(key.toLowerCase())) continue;
			
			result = this.#multiplicityMap[key]
					? this.#hydrateMultiple(result, key, value)
					: this.#hydrateSingle(result, key, value);
		}
		
		// ONLY for root level : handle NON-OWNED relations
		if (root) {
			result = this.#hydrateNonOwnedRelations(result, desc[0].entity); // desc[0].entity => "Ticket"
		}
		
		return result;
	}

	#hydrateSingle(result, key, value) {
		const entityList = this.#getEntityItems(key);
		if (!Array.isArray(entityList)) return;
		
		const entity = entityList.find(item => item.id === Number(value));
		if (entity) {
			// Recursively hydrate the nested entity
			result[key] = this.hydrateObject(entity, null, false);
		}
		return result;
	}
	
	#hydrateMultiple(result, key, value) {
		const ids = value.split(":");

		const entityList = this.#getEntityItems(key.toLowerCase());
		if (!Array.isArray(entityList)) return;
		
		result[key] = []

		for (const id of ids) {
			const entity = entityList.find(item => item.id === Number(id));
			if (entity) {
				// Recursively hydrate the nested entity
				result[key].push(this.hydrateObject(entity, null, false));
			}
		}
		
		return result;
	}
	
	/**
	 * Takes a description array (desc), filters it for entries with type "E",
	 * and creates an object that maps field names to their "multiple" property.
	 * This is essentially creating a lookup table that indicates
	 * which fields can have multiple values (like a one-to-many relationship)
	 * versus single values (one-to-one relationship).
	 * @param desc
	 */
	#initMultiplicityMap(desc) {
		this.#rootEntityName = desc[0].entity;
		
		this.#multiplicityMap = desc.filter(f => f.type === "E").reduce((a, f) => {
			a[f.field] = f.multiple
			return a;
		}, {});

		// @example
		// {
		//     "topic": false,
		//     "status": false,
		//     "sprint": true
		// }
	}
	
	// =============================================
	
	#hydrateNonOwnedRelations(obj, entityName) {
		// get all non-owned relations for current entity (eg : Ticket => Note, Activity)
		const relations = this.#getRelations(entityName)
		
		/* @example
		[
			{ entity: "Note", field: "ticket", multiple: false },
			{ entity: "Activity", field: "tickets", multiple: true },
		]
		*/
		
		let result = { ...obj }
		
		for (const rel of relations) {
			result = this.#hydrateNonOwnedRelation(result, rel)
		}
		
		return result;
	}
	
	#hydrateNonOwnedRelation(obj, { entity, field, multiple }) {
		const result = { ...obj }
		const propName = pascalToSnake(entity);
		result[propName] = this.#getRelatedItems(obj.id, propName, field, multiple)
		return result;
	}
	
	#getRelatedItems(targetId, ownerTableName, field, multiple) {
		const items = EntitySrv.getItems(ownerTableName) // snake_case
		
		return items.filter(i => {
			return multiple
				? i[field]?.split(":").includes(String(targetId))
				: Number(i[field]) === Number(targetId)
		})
	}
	
	#getRelations(tgtEntityName) {
		const items = EntitySrv.getItems("field_definition");
		return items
			.filter(i => i.type === "E" && i.rel_entity === tgtEntityName)
			.map(i => ({ entity: i.entity, field: i.field, multiple: i.multiple }))
	}
	
	// =============================================
	
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
	#getEntityItems(tableName) {
		return EntitySrv.getItems(tableName);
	}
}


export default HydrationSrv.getInstance();

