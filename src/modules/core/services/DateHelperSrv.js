import moment from 'moment-timezone';

/**
 * Service for handling date operations with support for UTC and Paris timezone
 * Implements the Singleton pattern to ensure a single instance throughout the application
 */
class DateHelperSrv {
	
	static #instance;
	
	/**
	 * Gets the singleton instance of DateHelperSrv
	 * @returns {DateHelperSrv} The singleton instance
	 */
	static getInstance() {
		if (!DateHelperSrv.#instance) {
			DateHelperSrv.#instance = new DateHelperSrv();
		}
		return DateHelperSrv.#instance;
	}

	/**
	 * Creates a Moment.js object in UTC timezone from a string
	 * @param {string} dateTimeStr - Date string in format "YYYY-MM-DD@HH:MM"
	 * @returns {moment.Moment} Moment object in UTC mode
	 */
	createMomentFromStringUTC(dateTimeStr) {
		// Replace @ with T to make it a valid ISO-like format
		const isoFormat = dateTimeStr.replace('@', 'T');
		// Create moment object in UTC mode
		return moment.utc(isoFormat);
	}

	/**
	 * Creates a Moment.js object in Paris timezone from a string
	 * Handles Daylight Saving Time (DST) automatically
	 * @param {string} dateTimeStr - Date string in format "YYYY-MM-DD@HH:MM"
	 * @returns {moment.Moment} Moment object in Paris timezone
	 */
	createMomentFromStringParis(dateTimeStr) {
		// Replace @ with T to make it a valid ISO-like format
		const isoFormat = dateTimeStr.replace('@', 'T');
		// Create moment object in Paris timezone with proper DST handling
		return moment.tz(isoFormat, 'Europe/Paris');
	}
	
	/**
	 * Checks if a date is before a reference date
	 * @param {string} date - Date string in format "YYYY-MM-DD@HH:MM"
	 * @param {string} refDate - Reference date string in format "YYYY-MM-DD@HH:MM"
	 * @param {boolean} acceptSameDate - If true, returns true when dates are equal
	 * @returns {boolean} true if date is before refDate (or equal if acceptSameDate is true)
	 */
	dateIsBefore(date, refDate, acceptSameDate = false) {
		const dateMoment = this.createMomentFromStringParis(date);
		const refDateMoment = this.createMomentFromStringParis(refDate);
		
		return acceptSameDate
			? dateMoment.isSameOrBefore(refDateMoment)
			: dateMoment.isBefore(refDateMoment);
	}
	
	/**
	 * Checks if a date is after a reference date
	 * @param {string} date - Date string in format "YYYY-MM-DD@HH:MM"
	 * @param {string} refDate - Reference date string in format "YYYY-MM-DD@HH:MM"
	 * @param {boolean} acceptSameDate - If true, returns true when dates are equal
	 * @returns {boolean} true if date is after refDate (or equal if acceptSameDate is true)
	 */
	dateIsAfter(date, refDate, acceptSameDate = false) {
		return this.dateIsBefore(refDate, date, acceptSameDate);
	}

	/**
	 * Checks if a date is between a start and end date
	 * @param {string} date - Date string in format "YYYY-MM-DD@HH:MM"
	 * @param {string} startDate - Start date string in format "YYYY-MM-DD@HH:MM"
	 * @param {string} endDate - End date string in format "YYYY-MM-DD@HH:MM"
	 * @param {boolean} acceptSameDate - If true, returns true when date equals start or end date
	 * @returns {boolean} true if date is between start and end dates (inclusive if acceptSameDate is true)
	 */
	dateIsBetween(date, startDate, endDate, acceptSameDate = false) {
		return this.dateIsBefore(date, endDate, acceptSameDate) && this.dateIsAfter(date, startDate, acceptSameDate);
	}

	/**
	 * Returns a formatted date string in the format "ddd DD MMM YYYY"
	 * @param {string} date - Date string in format "YYYY-MM-DD@HH:MM"
	 * @returns {string} Formatted date string
	 */	
	getFormattedDate(date) {
		// must return a string in format Lun 19 Mai 2025
		return moment(date).format('ddd DD MMM YYYY');
	}
	
	/**
	 * Generates an array of strings representing a series of continuous days.
	 * Example :
	 * start is "2025-04-29@00:00"
	 * end is "2025-05-02@00:00"
	 *
	 * the method will return
	 * ["2025-04-29@00:00", "2025-04-30@00:00", "2025-05-01@00:00", "2025-05-02@00:00"]
	 *
	 * @param {string} start - Date string in format "YYYY-MM-DD@HH:MM"
	 * @param {string} end - Date string in format "YYYY-MM-DD@HH:MM"
	 * @returns {string[]} Array of date strings in format "YYYY-MM-DD@HH:MM"
	 */
	generateContinuousDates(start, end) {
		const startMoment = this.createMomentFromStringParis(start);
		const endMoment = this.createMomentFromStringParis(end);
		
		const dates = [];
		let currentMoment = startMoment.clone();
		
		// Loop until we reach the end date (inclusive)
		while (currentMoment.isSameOrBefore(endMoment, 'day')) {
			// Format the date back to our custom format
			const dateStr = currentMoment.format('YYYY-MM-DD') + '@00:00';
			dates.push(dateStr);
			
			// Move to next day
			currentMoment.add(1, 'day');
		}
		
		return dates;
	}
	
}

export default DateHelperSrv.getInstance();

