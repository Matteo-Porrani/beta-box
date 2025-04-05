// =============================================
// TYPE CHECKING
// =============================================

export function isNull(value) {
	return value === null;
}

export function isUndefined(value) {
	return value === undefined;
}

export function isNullOrUndefined(value) {
	return isNull(value) || isUndefined(value);
}

export function isNaN(value) {
	return Number.isNaN(value);
}

export function isNumber(value) {
	return typeof value === 'number';
}

export function isInteger(value) {
	return Number.isInteger(value);
}

// Returns true if the value is falsy
export function isFalsy(value) {
	return !value;
}

// =============================================
// STRING CASE CONVERSION
// =============================================

// Transforms a string in PascalCase to snake_case
export function pascalToSnake(str) {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

// Transforms a string in snake_case to PascalCase
export function snakeToPascal(str) {
	return str.replace(/(^|_)(\w)/g, (_, prefix, letter) => letter.toUpperCase());
}

// =============================================
// OTHER
// =============================================

export function nrm(obj){
	return JSON.parse(JSON.stringify(obj));
}

export function parseDurationInMin(strDuration) {
	// returns 90 from 01:30
	// returns 60 from 01:00
	// returns 120 from 02:00
	// returns 30 from 0:30
	
	const [hours, minutes] = strDuration.split(':').map(Number);
	return (hours * 60) + minutes;
}
