class SearchService {
	static #instance = null;
	
	constructor() {
		if (SearchService.#instance) {
			throw new Error('Use SearchService.getInstance() to access the singleton instance.');
		}
	}
	
	static getInstance() {
		if (!SearchService.#instance) {
			SearchService.#instance = new SearchService();
		}
		return SearchService.#instance;
	}
	
	/**
	 * Filters an array of objects based on a needle string.
	 * It performs case-insensitive and accent-insensitive search.
	 *
	 * @param {Object[]} array - The array of objects to filter.
	 * @param {string|number|boolean} needle - The value to search for.
	 * @param {string|null} [specificKey=null] - If provided, only search in this key.
	 * @param {string|null} [excludeKey='id'] - Exclude this key from the search.
	 * @returns {Object[]} Filtered array of matching objects.
	 */
	filterObjectsByNeedle(array, needle, specificKey = null, excludeKey = 'id') {
		const normalizedNeedle = this.#normalize(String(needle));
		
		return array.filter(obj => {
			if (specificKey) {
				const value = obj[specificKey];
				return this.#valueMatches(value, normalizedNeedle, specificKey, excludeKey);
			} else {
				return this.#valueMatches(obj, normalizedNeedle, null, excludeKey);
			}
		});
	}
	
	/**
	 * Normalizes a string: lowercases it and strips accents.
	 *
	 * @param {string} str - The string to normalize.
	 * @returns {string} Normalized string.
	 */
	#normalize(str) {
		return str
			.normalize("NFD") // Decompose letters and accents
			.replace(/[\u0300-\u036f]/g, "") // Remove accents
			.toLowerCase();
	}
	
	/**
	 * Recursively checks whether a value or its children match the needle.
	 *
	 * @param {*} val - The current value to check.
	 * @param {string} normalizedNeedle - The processed needle string.
	 * @param {string|null} key - The current key name.
	 * @param {string|null} excludeKey - A key name to exclude from search.
	 * @returns {boolean}
	 */
	#valueMatches(val, normalizedNeedle, key = null, excludeKey = 'id') {
		if (key === excludeKey) return false;
		if (val === null || val === undefined) return false;
		
		if (typeof val === 'object') {
			return Object.entries(val).some(
				([k, v]) => this.#valueMatches(v, normalizedNeedle, k, excludeKey)
			);
		}
		
		const normalizedVal = this.#normalize(String(val));
		return normalizedVal.includes(normalizedNeedle);
	}
}

export default SearchService.getInstance();
