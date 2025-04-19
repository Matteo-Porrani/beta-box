
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


