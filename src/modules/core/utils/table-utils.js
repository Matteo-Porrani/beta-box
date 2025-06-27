import { isObjectNotNull } from "@/modules/core/utils/core-utils";

/**
 * Filters an array of objects based on a search term (needle).
 * 
 * @param {Array<Object>} array - The array of objects to filter
 * @param {string|number} needle - The search term to filter by
 * @param {string|null} specificKey - Optional. If provided, only search within this object key
 * @returns {Array<Object>} Filtered array of objects that match the search criteria
 * 
 * @example
 * // Search in all object values
 * const users = [
 *   { name: 'John Doe', age: 30, role: 'developer' },
 *   { name: 'Jane Smith', age: 25, role: 'designer' },
 *   { name: 'Bob Johnson', age: 35, role: 'developer' }
 * ];
 * filterObjectsByNeedle(users, 'dev') 
 * // Returns [
 * //   { name: 'John Doe', age: 30, role: 'developer' },
 * //   { name: 'Bob Johnson', age: 35, role: 'developer' }
 * // ]
 * 
 * @example
 * // Search only in specific key
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1200 },
 *   { id: 2, name: 'Mouse', price: 25 },
 *   { id: 3, name: 'Keyboard', price: 100 }
 * ];
 * filterObjectsByNeedle(products, 'mouse', 'name')
 * // Returns [{ id: 2, name: 'Mouse', price: 25 }]
 */
export function filterTableByNeedle(array, needle, specificKey = null) {
	// Convert search term to lowercase for case-insensitive comparison
	const lowerNeedle = String(needle).toLowerCase();
	
	return array.filter(obj => {
		if (specificKey) {
			// If specificKey is provided, only search within that key
			const value = obj[specificKey];
			return value !== undefined && String(value).toLowerCase().includes(lowerNeedle);
		} else {
			// Otherwise, search across all object values
			return Object.values(obj).some(value =>
				value !== undefined && String(value).toLowerCase().includes(lowerNeedle)
			);
		}
	});
}




export function filterArrayWithDeepMatch(array, needle, exclude = [], only = null) {
	return array
		.map(obj => structuredClone(obj))
		.filter(obj => flatObjectMatchesSearch(obj, needle, exclude, only))
}

export function flatObjectMatchesSearch(object, needle, exclude = [], only = null) {
	const flatObject = flattenObject(object, exclude);
	const flatValues = extractValues(object, exclude);
	
	return only
		? flatObject[only]?.toLowerCase().includes(needle.toLowerCase()) // check on specific key
		: flatValues.some(value => String(value).toLowerCase().includes(needle.toLowerCase()));
}

/**
 * Recursively extracts all primitive values from a nested object structure.
 * Arrays and objects are traversed deeply.
 *
 * @param {object} obj - The input object to extract values from.
 * @param {array} exclude - The input object to extract values from.
 * @returns {Array} - A flat array containing all primitive values found.
 */
export function extractValues(obj, exclude = []) {
	let vals = [] // Initialize an array to collect values
	
	// Iterate over the values of the object
	for (let [k, v] of Object.entries(obj)) {
		if (exclude.includes(k)) continue;
		if (typeof v === "object") {
			// If the value is an array, recurse on each element
			if (Array.isArray(v)) {
				v.forEach(intV => {
					if (typeof intV === "object") {
						vals.push(extractValues(intV, exclude))
					} else {
						vals.push(intV); // handles arrays of primitives
					}
				})
			} else {
				// If it's an object (but not an array), recurse directly
				vals.push(extractValues(v, exclude))
			}
		} else {
			// If the value is a primitive (string, number, boolean, etc.), add it
			vals.push(v)
		}
	}
	
	// Flatten the nested arrays into a single-level array (deep flatten)
	return vals.flat(Infinity).map(v => String(v));
}

/**
 * Recursively flattens a nested object into a single-level object.
 *
 * - Nested objects are merged into the top-level object with their properties preserved.
 * - Arrays are stringified.
 * - Keys listed in the `exclude` array are skipped.
 *
 * @param {Object} object - The input object to flatten.
 * @param {string[]} [exclude=[]] - An array of keys to exclude from flattening.
 * @returns {Object} A new flat object with all nested keys merged at the top level.
 *
 * @example
 * flattenObject({
 *   name: "Alice",
 *   info: {
 *     age: 30,
 *     address: {
 *       city: "Paris"
 *     }
 *   },
 *   tags: ["dev", "designer"]
 * });
 * // Returns:
 * // { name: "Alice", age: 30, city: "Paris", tags: "[\"dev\",\"designer\"]" }
 */
export function flattenObject(object, exclude = []) {
	const flatEntries = [];
	
	for (const [key, value] of Object.entries(object)) {
		if (exclude.length > 0 && exclude.includes(key)) continue;
		
		flatEntries.push(
			(typeof value === "object" && !Array.isArray(value))
				? flattenObject(value, exclude)
				: Array.isArray(value)
					? { [key]: JSON.stringify(value) }
					: { [key]: value }
		)
	}
	
	return flatEntries.flat(Infinity)
		.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}


export function sortRows(rows, byKey, sortAsc) {
	rows.sort((a, b) => {
		let valA = a[byKey];
		let valB = b[byKey];
		
		// if both values are objects, retrieve a primitive value for comparison
		if (isObjectNotNull(valA) && isObjectNotNull(valB)) {
			valA = _getPrimitiveSortValue(valA);
			valB = _getPrimitiveSortValue(valB);
		}
		
		// If both values are numbers, compare numerically
		if (!isNaN(valA) && !isNaN(valB)) return Number(valA) - Number(valB);
		
		// Otherwise, compare as strings
		return String(valA).localeCompare(String(valB));
	});
	
	if (!sortAsc) rows.reverse();
	return rows;
}

function _getPrimitiveSortValue(objValue) {
	if (Object.hasOwn(objValue, "name")) return objValue.name;
	if (Object.hasOwn(objValue, "title")) return objValue.title;
	return objValue.id;
}




/**
 * Mutates (updates) objects in an array by applying a set of properties (patch),
 * optionally filtering which items to update and restricting which properties are allowed.
 *
 * This function is useful for bulk-editing items in-place, such as marking form steps
 * as "visited", "current", or "errored", without replacing the objects.
 *
 * @template T
 * @param {T[]} array - The array of objects to be mutated.
 * @param {Partial<T>} patch - An object containing the properties and values to assign to each selected item.
 * @param {(item: T) => boolean} [filterFn] - Optional. A predicate function to select which items to update. Defaults to all items.
 * @param {Array<keyof T>} [whitelist] - Optional. A list of property names that are allowed to be updated. If omitted, all keys in `patch` are applied.
 *
 * @example
 * mutateItems(steps, { visited: true, error: false })
 * // Marks all steps as visited, removes error state
 *
 * @example
 * mutateItems(steps, { current: true }, step => step.label === 'Blue')
 * // Sets only the "Blue" step to current
 *
 * @example - the 'whitelist' argument is provided, only 'visited' will be updated
 * mutateItems(steps, { foo: 'bar', visited: true }, undefined, ['visited'])
 * // Only applies `visited`, silently ignores `foo`
 */
export function mutateItems(array, patch, filterFn = () => true, whitelist = null) {
	for (const item of array) {
		// Check if this item matches the filter criteria
		if (filterFn(item)) {
			// If a whitelist is provided, strip out any patch keys not listed
			const safePatch = whitelist
				? Object.fromEntries(
					Object.entries(patch).filter(([key]) => whitelist.includes(key))
				)
				: patch
			
			// Apply the patch to the item (mutating it directly)
			Object.assign(item, safePatch)
		}
	}
}

