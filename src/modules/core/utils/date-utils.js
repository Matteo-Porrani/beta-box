// import moment from "moment";
import { DateTime } from "luxon";

function _formatDate(dtString) {
	const datePart = _getDatePart(dtString);
	const [y, m, d] = datePart.split("-");
	return `${d}/${m}/${y}`;
}

function _getDatePart(dtString) {
	const parts = dtString.split("@");
	return parts[0];
}



export function convertFromAppDateFormatToStdFormat(str) {
	return _formatDate(str)
}

export function splitDurationIntoHourPercents(minutes) {
	const result = [];
	
	const fullHours = Math.floor(minutes / 60);
	const remainder = minutes % 60;
	
	// Add full hours
	for (let i = 0; i < fullHours; i++) {
		result.push(100);
	}
	
	// Add fraction of hour if any
	if (remainder > 0) {
		result.push((remainder / 60) * 100);
	}
	
	return result;
}


/**
 * Creates an array of time elements using moment.js
 *
 * @param {Object} options
 * @param {"day"|"month"|"year"} options.unit - time unit
 * @param {number} options.count - number of elements (positive = forward, negative = backward)
 * @param {string} options.start - start date string
 * @returns {string[]} formatted date strings
 */
export function buildTimeRange({ unit, count, start }) {
	// --- 1. Unit Validation
	const formatMap = {
		day: "yyyy-MM-dd",
		month: "yyyy-MM",
		year: "yyyy",
	};
	
	if (!formatMap[unit]) {
		throw new Error(
			`Invalid unit "${unit}". Supported units: ${Object.keys(formatMap).join(", ")}.`
		);
	}
	
	// --- 2. Count Validation
	if (typeof count !== "number" || isNaN(count) || !Number.isInteger(count)) {
		throw new Error(`Invalid count "${count}". It must be an integer.`);
	}
	if (count === 0) return [];
	
	// --- 3. Date Format Validation
	const format = formatMap[unit];
	const startDate = DateTime.fromFormat(start, format);
	
	if (!startDate.isValid) {
		throw new Error(
			`Invalid start date "${start}" for unit "${unit}". Expected format: "${format}".`
		);
	}
	
	const absCount = Math.abs(count);
	const step = Math.sign(count);
	const result = [];
	
	let current = startDate;
	
	for (let i = 0; i < absCount; i++) {
		result.push(current.toFormat(format));
		current = current.plus({ [unit]: step }); // Luxon is immutable, no need to clone
	}
	
	return result;
}


