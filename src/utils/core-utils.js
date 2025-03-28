export function isNull(value) {
	return value === null;
}

// Transforms a string in PascalCase to snake_case
export function pascalToSnake(str) {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

// Transforms a string in snake_case to PascalCase
export function snakeToPascal(str) {
	return str.replace(/(^|_)(\w)/g, (_, prefix, letter) => letter.toUpperCase());
}
