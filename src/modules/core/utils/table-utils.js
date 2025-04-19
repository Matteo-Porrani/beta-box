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
		// console.log(JSON.stringify(obj))
		
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
	const sortedRows = rows.sort((a, b) => {
		const valA = a[byKey];
		const valB = b[byKey];
		
		// If both values are numbers, compare numerically
		if (!isNaN(valA) && !isNaN(valB)) {
			return Number(valA) - Number(valB);
		}
		
		// Otherwise, compare as strings
		return String(valA).localeCompare(String(valB));
	});
	
	if (!sortAsc) sortedRows.reverse();
	return sortedRows;
}
