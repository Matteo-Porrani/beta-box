import moment from 'moment-timezone';

class DateHelperSrv {
	
	static #instance;
	
	static getInstance() {
		if (!DateHelperSrv.#instance) {
			DateHelperSrv.#instance = new DateHelperSrv();
		}
		return DateHelperSrv.#instance;
	}

	createMomentFromStringUTC(dateTimeStr) {
		// Replace @ with T to make it a valid ISO-like format
		const isoFormat = dateTimeStr.replace('@', 'T');
		// Create moment object in UTC mode
		const m = moment.utc(isoFormat);

		console.log(m.format());
		return m;
	}

	createMomentFromStringParis(dateTimeStr) {
		// Replace @ with T to make it a valid ISO-like format
		const isoFormat = dateTimeStr.replace('@', 'T');
		// Create moment object in Paris timezone with proper DST handling
		const m = moment.tz(isoFormat, 'Europe/Paris');
		
		console.log(m.format());
		return m;
	}
	
	
	/**
	 *
	 * @param {string} date - format YYYY/MM/DD@HH:MM
	 * @param {string} refDate - format YYYY/MM/DD@HH:MM
	 * @param {boolean} acceptSameDate - if true, returns true when dates are equal
	 * @returns {boolean} true if date is before refDate (or equal if acceptSameDate is true)
	 */
	dateIsBefore(date, refDate, acceptSameDate = false) {
		const dateMoment = this.createMomentFromStringParis(date);
		const refDateMoment = this.createMomentFromStringParis(refDate);
		
		return acceptSameDate
			? dateMoment.isSameOrBefore(refDateMoment)
			: dateMoment.isBefore(refDateMoment);
	}
	
	dateIsAfter(date, refDate, acceptSameDate = false) {
		return this.dateIsBefore(refDate, date, acceptSameDate);
	}
	
}

export default DateHelperSrv.getInstance();

