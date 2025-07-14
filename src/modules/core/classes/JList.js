export class JList {
	
	#items;
	
	constructor(items = []) {
		this.#validateItems(items);
		this.#items = structuredClone(items);
	}
	
	// =============================================
	
	/**
	 * @param {Array<object>} items
	 * @throws {TypeError} If items is not an array or contains invalid objects
	 */
	#validateItems(items) {
		if (!Array.isArray(items)) {
			throw new TypeError("JList expects an array of objects.");
		}
		
		for (const [index, item] of items.entries()) {
			if (typeof item !== "object" || item === null) {
				throw new TypeError(`Item at index ${index} is not a valid object.`);
			}
		}
	}
	
	#matchesCriteria(item, criteria) {
		return criteria.every(criterion => {
			const value = item[criterion.key];
			return criterion.matchFn(value);
		});
	}
	
	// =============================================
	
	get items() {
		return this.#items;
	}
	
	get size() {
		return this.#items.length;
	}
	
	get first() {
		return this.#items[0];
	}
	
	get last() {
		return this.#items[this.#items.length - 1];
	}
	
	at(index) {
		return this.#items[index];
	}
	
	has(id) {
		return this.#items.some(item => item.id === id);
	}
	
	// =============================================
	
	add(item, { prepend = false } = {}) {
		if (typeof item !== "object" || item === null) {
			throw new TypeError("Item must be a valid object.");
		}
		
		if (this.has(item.id)) {
			throw new TypeError(`Item with id '${item.id}' already exists.`);
		}
		
		if (prepend) {
			this.#items.unshift(item);
		} else {
			this.#items.push(item);
		}
	}
	
	delete(criteria) {
		const originalSize = this.#items.length;
		this.#items = this.#items.filter(item => {
			return !this.#matchesCriteria(item, criteria);
		});
		return originalSize - this.#items.length;
	}
	
	deleteById(id) {
		const originalSize = this.#items.length;
		this.#items = this.#items.filter(item => item.id !== id);
		return originalSize - this.#items.length;
	}
	
	update(criteria, changes) {
		let updatedCount = 0;
		
		this.#items.forEach(item => {
			if (this.#matchesCriteria(item, criteria)) {
				const originalId = item.id;
				Object.assign(item, changes);
				item.id = originalId; // Prevent ID mutation
				updatedCount++;
			}
		});
		
		return updatedCount;
	}
	
	updateById(id, changes) {
		const idxToUpdate = this.#items.findIndex(item => item.id === id);
		if (idxToUpdate > -1) {
			const targetItem = this.#items[idxToUpdate];
			const originalId = targetItem.id;
			Object.assign(targetItem, changes);
			targetItem.id = originalId; // Prevent ID mutation

			return 1;
		}
		return 0;
	}
	
	updateWithFn(criteria, updateSpecs) {
		let updatedCount = 0;
		
		this.#items.forEach(item => {
			if (this.#matchesCriteria(item, criteria)) {
				updateSpecs.forEach(spec => {
					item[spec.key] = spec.updateFn(item[spec.key]);
				});
				updatedCount++;
			}
		});
		
		return updatedCount;
	}
	
	// =============================================
	
	find(criteria) {
		return this.#items.filter(item => this.#matchesCriteria(item, criteria));
	}
	
	findById(id) {
		return this.#items.find(item => item.id === id);
	}

	// =============================================

	replaceItems(items) {
		this.#validateItems(items);
		this.#items = structuredClone(items);
	}

	sort({ key = "id", order = 1 } = {}) {

		if (typeof key !== "string") {
			throw new TypeError("Sort key must be a string.");
		}

		if (order !== 1 && order !== -1) {
			throw new TypeError("Sort order must be 1 (ascending) or -1 (descending).");
		}

		// Helper function to get nested property value
		const getNestedValue = (obj, keyPath) => {
			return keyPath.split('.').reduce((current, prop) => {
				return current?.[prop];
			}, obj);
		};

		// Validate that the key path exists on all items
		for (const item of this.#items) {
			const value = getNestedValue(item, key);
			if (value === undefined) {
				throw new TypeError(`Key path '${key}' not found on item with id '${item.id}'.`);
			}
		}

		this.#items.sort((a, b) => {
			const valueA = getNestedValue(a, key);
			const valueB = getNestedValue(b, key);

			return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * order;
		});
	}
	
}




