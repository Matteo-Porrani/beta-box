export class JList {
	
	#items;
	
	constructor(items = []) {
		this.#validateItems(items);
		this.#items = structuredClone(items);
	}
	
	
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
			return !criteria.every(criterion => {
				const value = item[criterion.key];
				return criterion.matchFn(value);
			});
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
			const matches = criteria.every(criterion => {
				const value = item[criterion.key];
				return criterion.matchFn(value);
			});
			
			if (matches) {
				Object.assign(item, changes);
				updatedCount++;
			}
		});
		
		return updatedCount;
	}
	
	updateWithFn(criteria, updateSpecs) {
		let updatedCount = 0;
		
		this.#items.forEach(item => {
			const matches = criteria.every(criterion => {
				const value = item[criterion.key];
				return criterion.matchFn(value);
			});
			
			if (matches) {
				updateSpecs.forEach(spec => {
					item[spec.key] = spec.updateFn(item[spec.key]);
				});
				updatedCount++;
			}
		});
		
		return updatedCount;
	}
	
}




