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

export function isObjectNotNull(value) {
	if (isNullOrUndefined(value)) return false;
	return typeof value === "object";
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

// uppercase first letter
export function ucFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
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
	const [hours, minutes] = strDuration.split(':').map(Number);
	return (hours * 60) + minutes;
}
export function formatDurationFromMin(totalMinutes) {
	// returns '01:30' from 90
	// returns '01:00' from 60
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

