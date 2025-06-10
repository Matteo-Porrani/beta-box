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

