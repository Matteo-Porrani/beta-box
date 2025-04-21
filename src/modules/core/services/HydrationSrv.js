/**
 * HydrationSrv is a singleton service responsible for transforming flat objects with reference IDs
 * into fully nested entity objects.
 * For example, it can convert a Ticket with a `status` ID
 * into a Ticket with a complete nested `status` object.
 *
 * The service works by:
 * 1. Detecting which keys need hydration by matching against known entity names
 * 2. Handling both owned and non-owned relationships
 * 3. Supporting both single (one-to-one) and multiple (one-to-many) relationships
 * 4. Recursively hydrating nested entities to any depth
 *
 * Entity relationships are defined in the 'field_definition' table
 * and retrieved dynamically via EntitySrv.
 */

import EntitySrv from "@/modules/core/services/EntitySrv";
import { pascalToSnake } from "@/modules/core/utils/core-utils";


class HydrationSrv {
	static #instance = null;
	
	/** @type {string[] | null} Cache of known entity types (in snake case) */
	#entityTypesCache = null;
	
	/** @type {Object.<string, boolean> | null} Maps field names to their multiplicity (true for one-to-many, false for one-to-one) */
	#multiplicityMap = null;
	
	/** @type {string | null} Name of the root entity being hydrated */
	#rootEntityName = null;

	/**
	 * Returns the singleton instance of HydrationSrv
	 * @returns {HydrationSrv} The singleton instance
	 */
	static getInstance() {
		if (!HydrationSrv.#instance) {
			HydrationSrv.#instance = new HydrationSrv();
		}
		return HydrationSrv.#instance;
	}

	// =============================================
	
	/**
	 * Hydrates an object by replacing foreign key IDs with nested entity objects.
	 * This method recursively hydrates entities at multiple levels, handling both
	 * owned and non-owned relationships.
	 *
	 * @param {Object} obj - The flat object to hydrate (e.g., a Task with status ID)
	 * @param {Object[]} desc - Array of field definitions describing entity relationships
	 * @param {Boolean} root - Whether this is the root level of hydration
	 * @returns {Object} The fully hydrated object with nested entity data
	 */
	hydrateObject(obj, desc, root = true) {
		if (Array.isArray(desc)) this.#initMultiplicityMap(desc);
		
		let result = { ...obj };
		
		// Handle relations owned by the object (direct foreign keys)
		for (const [key, value] of Object.entries(obj)) {
			if (!this.#getEntityTypes().includes(key.toLowerCase())) continue;
			
			result = this.#multiplicityMap[key]
					? this.#hydrateMultiple(result, key, value)
					: this.#hydrateSingle(result, key, value);
		}
		
		// Handle non-owned relations (reverse relationships) at root level only
		if (root) {
			result = this.#hydrateNonOwnedRelations(result, desc[0].entity);
		}
		
		return result;
	}

	/**
	 * Hydrates a single (one-to-one) relationship
	 * @param {Object} result - The object being hydrated
	 * @param {string} key - The field name containing the foreign key
	 * @param {string|number} value - The foreign key value
	 * @returns {Object} The object with the hydrated relationship
	 */
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
	
	/**
	 * Hydrates a multiple (one-to-many) relationship
	 * @param {Object} result - The object being hydrated
	 * @param {string} key - The field name containing the foreign keys
	 * @param {string} value - Colon-separated list of foreign key values
	 * @returns {Object} The object with the hydrated relationships
	 */
	#hydrateMultiple(result, key, value) {
		const ids = value.split(":");

		const entityList = this.#getEntityItems(key.toLowerCase());
		if (!Array.isArray(entityList)) return;
		
		result[key] = []

		for (const id of ids) {
			const entity = entityList.find(item => item.id === Number(id));
			if (entity) {
				// Recursively hydrate each nested entity
				result[key].push(this.hydrateObject(entity, null, false));
			}
		}
		
		return result;
	}
	
	/**
	 * Initializes the multiplicity map from field definitions
	 * Creates a lookup table indicating which fields can have multiple values
	 * (one-to-many relationships) versus single values (one-to-one relationships)
	 * 
	 * @param {Object[]} desc - Array of field definitions
	 * @example
	 * // Resulting multiplicity map:
	 * {
	 *     "topic": false,  // one-to-one relationship
	 *     "status": false, // one-to-one relationship
	 *     "sprint": true   // one-to-many relationship
	 * }
	 */
	#initMultiplicityMap(desc) {
		this.#rootEntityName = desc[0].entity;
		
		this.#multiplicityMap = desc.filter(f => f.type === "E").reduce((a, f) => {
			a[f.field] = f.multiple
			return a;
		}, {});
	}
	
	// =============================================
	
	/**
	 * Hydrates all non-owned relationships for an entity
	 * These are reverse relationships where other entities reference this one
	 * 
	 * @param {Object} obj - The object being hydrated
	 * @param {string} entityName - Name of the entity being hydrated
	 * @returns {Object} The object with hydrated non-owned relationships
	 */
	#hydrateNonOwnedRelations(obj, entityName) {
		const relations = this.#getNonOwnedRelations(entityName)
		
		let result = { ...obj }
		
		for (const rel of relations) {
			result = this.#hydrateNonOwnedRelation(result, rel)
		}
		
		return result;
	}
	
	/**
	 * Hydrates a single non-owned relationship
	 * @param {Object} obj - The object being hydrated
	 * @param {Object} rel - The relationship definition
	 * @param {string} rel.entity - The related entity name
	 * @param {string} rel.field - The field name in the related entity
	 * @param {boolean} rel.multiple - Whether it's a one-to-many relationship
	 * @returns {Object} The object with the hydrated relationship
	 */
	#hydrateNonOwnedRelation(obj, { entity, field, multiple }) {
		const result = { ...obj }
		const key = pascalToSnake(entity);
		result[key] = this.#getRelatedItems(obj.id, key, field, multiple)
		return result;
	}
	
	/**
	 * Retrieves related items for a non-owned relationship
	 * @param {number} targetId - ID of the entity being hydrated
	 * @param {string} ownerTableName - Name of the related entity table
	 * @param {string} field - Field name in the related entity
	 * @param {boolean} multiple - Whether it's a one-to-many relationship
	 * @returns {Object[]} Array of related entities
	 */
	#getRelatedItems(targetId, ownerTableName, field, multiple) {
		const items = EntitySrv.getItems(ownerTableName)
		
		return items.filter(i => {
			return multiple
				? i[field]?.split(":").includes(String(targetId))
				: Number(i[field]) === Number(targetId)
		})
	}
	
	/**
	 * Retrieves all relationships where other entities reference the target entity
	 * @param {string} tgtEntityName - Name of the target entity
	 * @returns {Object[]} Array of relationship definitions
	 * @example
	 * // For a Ticket entity:
	 * [
	 *     { entity: "Note", field: "ticket", multiple: false },
	 *     { entity: "Activity", field: "tickets", multiple: true }
	 * ]
	 */
	#getNonOwnedRelations(tgtEntityName) {
		const items = EntitySrv.getItems("field_definition");
		return items
			.filter(i => i.type === "E" && i.rel_entity === tgtEntityName)
			.map(i => ({
				entity: i.entity,
				field: i.field,
				multiple: i.multiple
			}))
	}
	
	// =============================================
	
	/**
	 * Retrieves and caches the list of known entity types
	 * @returns {string[]} Array of entity type names in lowercase
	 */
	#getEntityTypes() {
		if (!this.#entityTypesCache) {
			this.#entityTypesCache = EntitySrv.getEntityTypes();
		}
		return this.#entityTypesCache;
	}
	
	/**
	 * Retrieves all items for a given entity type
	 * @param {string} tableName - Entity type name (e.g., 'status', 'color')
	 * @returns {Object[]} Array of flat entity objects
	 */
	#getEntityItems(tableName) {
		return EntitySrv.getItems(tableName);
	}
}

export default HydrationSrv.getInstance();

