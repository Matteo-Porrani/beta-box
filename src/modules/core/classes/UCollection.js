export class UCollection {
	#items;
	
	/**
	 * @param {Array<object>} items
	 * @throws {TypeError} If items is not an array or contains invalid objects
	 */
	constructor(items) {
		this.#validateItems(items);
		this.#items = [...items]; // defensively copy
	}
	
	/**
	 * @param {Array<object>} items
	 * @throws {TypeError} If items is not an array or contains invalid objects
	 */
	#validateItems(items) {
		if (!Array.isArray(items)) {
			throw new TypeError("UCollection expects an array of objects.");
		}
		
		for (const [index, item] of items.entries()) {
			if (typeof item !== "object" || item === null || !Object.hasOwn(item, "id")) {
				throw new TypeError(`Item at index ${index} is not a valid object.`);
			}
		}
	}
	
	/**
	 * @returns {number}
	 */
	get count() {
		return this.#items.length;
	}
	
	/**
	 * @returns {Array<object>}
	 */
	get items() {
		return [...this.#items];
	}
	
	/**
	 * @param {Array<object>} items
	 * @throws {TypeError} If items is not an array or contains invalid objects
	 */
	replace(items) {
		this.#validateItems(items);
		this.#items = [...items];
	}
	
	/**
	 * @param {number} idx
	 * @returns {object|undefined}
	 */
	at(idx) {
		const item = this.#items.at(idx);
		return item ? structuredClone(item) : undefined;
	}
	
	/**
	 * @returns {object|undefined}
	 */
	get first() {
		return this.at(0);
	}
	
	/**
	 * @returns {object|undefined}
	 */
	get last() {
		return this.at(-1);
	}
	
	/**
	 * @param {number|string} id
	 * @returns {boolean}
	 */
	has(id) {
		if (!id) return false;
		return this.#items.some(el => String(el.id) === String(id));
	}
	
	/**
	 * @param {number|string} id
	 * @returns {object|undefined}
	 */
	findById(id) {
		return this.#items.find(el => String(el.id) === String(id));
	}
	
	/**
	 * @param {Array<{ key: string, matchFn: function }>} filters
	 * @example
	 * [
	 *   { key: "color", matchFn: (value) => value === "red" },
	 *   { key: "age", matchFn: (value) => value < 40 },
	 * ]
	 * @returns { object[] }
	 */
	findBy(filters) {
		return this.#items.filter(el => this.#itemMatchesFilters(el, filters));
	}
	
	/**
	 * Adds a new item to the collection.
	 *
	 * @param {object} item - The object to add (must have an "id" property).
	 * @param {object} [options]
	 * @param {boolean} [options.prepend=false] - If true, adds at the beginning.
	 * @param {boolean} [options.noDuplicate=false] - If true, avoids adding if an identical object exists.
	 * @returns {boolean} - True if item was added, false if it was skipped.
	 */
	add(item, { prepend = false, noDuplicate = false } = {}) {
		if (typeof item !== "object" || item === null || !Object.hasOwn(item, "id")) {
			throw new TypeError("Item must be a non-null object with an 'id' property.");
		}
		
		// ID uniqueness guard
		const hasSameId = this.#items.some(existing => String(existing.id) === String(item.id));
		if (hasSameId) {
			throw new Error(`An item with id "${item.id}" already exists.`);
		}
		
		if (noDuplicate) {
			const exists = this.#items.some(existing => this.#deepEqual(existing, item));
			if (exists) return false;
		}
		
		prepend ? this.#items.unshift(item) : this.#items.push(item);
		return true;
	}
	
	/**
	 * Updates all items matching the given filters.
	 *
	 * @param {object} changes - key/value pairs to merge into matching items.
	 * @param {Array<{ key: string, matchFn: function }>} filters - filters to identify target items.
	 * @returns {number} The number of items updated.
	 */
	update(changes, filters) {
		let updatedCount = 0;
		
		this.#items = this.#items.map(item => {
			if (this.#itemMatchesFilters(item, filters)) {
				updatedCount++;
				return {
					...item,
					...changes,
					id: item.id, // prevent ID overwrite
				};
			}
			return item;
		});
		
		return updatedCount;
	}
	
	/**
	 * @param {object} changes - key/value pairs to merge into matching items.
	 * @param {number|string|number[]|string[]} id
	 * @returns {number}
	 */
	updateById(changes, id) {
		if (Array.isArray(id)) return id.reduce((a, intId) => a.concat(this.updateById(changes, intId)), []).length;
		return this.update(changes, [{ key: "id", matchFn: v => String(v) === String(id) }]);
	}
	
	/**
	 * Deletes all items matching the given filters.
	 *
	 * @param {Array<{ key: string, matchFn: function }>} filters
	 * @returns {number} - The number of items removed.
	 */
	delete(filters) {
		const beforeCount = this.#items.length;
		
		this.#items = this.#items.filter(item => !this.#itemMatchesFilters(item, filters));
		
		const afterCount = this.#items.length;
		return beforeCount - afterCount;
	}
	
	/**
	 * @param {number|string} id
	 * @returns {boolean}
	 */
	deleteById(id) {
		const index = this.#items.findIndex(el => String(el.id) === String(id));
		if (index === -1) return false;
		this.#items.splice(index, 1);
		return true;
	}
	
	/**
	 * @param {string} key
	 * @param {boolean} asc
	 */
	sort({ key = "id", asc = true } = {}) {
		this.#items = [...this.#items].sort((a, b) => {
			const aVal = a[key];
			const bVal = b[key];

			// Handle undefined/null values
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return asc ? 1 : -1;
			if (bVal == null) return asc ? -1 : 1;

			// Check if both values are numbers
			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return asc ? aVal - bVal : bVal - aVal;
			}

			// Convert to strings for comparison (handles mixed types)
			const aStr = String(aVal);
			const bStr = String(bVal);
			return asc ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
		});
	}
	
	/**
	 * @param {object} item
	 * @param {Array<{ key: string, matchFn: function }>} filters
	 * @returns {*}
	 *
	 * @example
	 * [
	 *   { key: color, matchFn: (value) => value === "red" },
	 *   { key: age, matchFn: (value) => value < 41 },
	 * ]
	 */
	#itemMatchesFilters(item, filters) {
		return filters.every(({ key, matchFn }) => matchFn(item[key]));
	}
	
	/**
	 * Performs a deep comparison between two values.
	 *
	 * @param {*} a - first value to compare
	 * @param {*} b - second value to compare
	 * @returns {boolean} - true if deeply equal, false otherwise
	 */
	#deepEqual(a, b) {
		if (a === b) return true;
		if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
		
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) return false;
		
		return keysA.every(key => this.#deepEqual(a[key], b[key]));
	}
	
}
