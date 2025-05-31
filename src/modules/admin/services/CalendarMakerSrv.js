// noinspection JSAnnotator

/**
 * CalendarMakerSrv - A service class for generating calendar data
 * This service uses the Luxon DateTime library for date manipulation
 * and implements the Singleton pattern to ensure only one instance exists
 */
import { DateTime } from "luxon";

class CalendarMakerSrv {
	// Private static instance for Singleton pattern
	static #instance;
	
	/**
	 * Gets the singleton instance of CalendarMakerSrv
	 * Creates a new instance if one doesn't exist
	 * @returns {CalendarMakerSrv} The singleton instance
	 */
	static getInstance() {
		if (!CalendarMakerSrv.#instance) {
			CalendarMakerSrv.#instance = new CalendarMakerSrv();
		}
		return CalendarMakerSrv.#instance;
	}
	
	// =============================================
	
	/**
	 * Parses a calendar table for a given origin date
	 * Generates an array of days including padding days for complete weeks
	 * @param {string} originDate - ISO date string (e.g., "2025-01-01")
	 * @returns {Object} Object containing month info and array of days
	 * @returns {string} returns.monthName - Full month name
	 * @returns {string} returns.monthYear - Year as string
	 * @returns {Object}
	 */
	parseCalendarTable(originDate) {
		const { cellsCount, tableA, monthName, monthNumber, monthYear } = this.getInfoFromOriginDate(originDate)
		
		const days = [];
		
		// Generate array of days including padding days
		for (let i = 0; i < cellsCount; i++) {
			const day = tableA.plus({ days: i });
			// Check if the day belongs to the current month
			const isPadding = day.month !== monthNumber;
			// Check if the day is today
			const isToday = day.toISODate() === DateTime.now().toISODate();
			days.push({
				"date": day.toISODate(),
				"isPadding": isPadding,
				"isToday": isToday
			})
		}
		
		return {
			monthName,
			monthYear,
			days,
			rowsCount: days.length / 7
		}
	}
	
	/**
	 * Extracts calendar information from a given origin date
	 * Calculates month boundaries, padding days, and other calendar metadata
	 * @param {string} originDate - ISO date string (e.g., "2025-01-01")
	 * @returns {Object} Object containing calendar metadata
	 * @returns {number} returns.cellsCount - Total number of cells needed (including padding)
	 * @returns {DateTime} returns.tableA - First day of the calendar table
	 * @returns {number} returns.monthNumber - Month number (1-12)
	 * @returns {string} returns.monthName - Full month name
	 * @returns {string} returns.monthYear - Year as string
	 */
	getInfoFromOriginDate(originDate) {
		const origin = DateTime.fromISO(originDate);
		
		// Get start and end of the month
		const monthStart = origin.startOf("month");
		const monthEnd = origin.endOf("month");
		
		// Calculate total cells needed including padding days
		// Formula: days in month + padding at start + padding at end
		const info = {
			cellsCount: monthStart.daysInMonth + (monthStart.weekday - 1) + (7 - monthEnd.weekday),
			tableA: monthStart.startOf("week"), // First day of the calendar table
			monthNumber: monthStart.month,
			monthName: monthStart.toFormat("MMMM"),
			monthYear: monthStart.toFormat("yyyy"),
			
			// Additional metadata (commented out but available if needed)
			// monthA: monthStart.toISODate(),
			// monthZ: monthEnd.toISODate(),
			// tableZ: monthEnd.endOf("week").toISODate(),
			// daysInMonth: origin.daysInMonth,
			// weekdayA: monthStart.weekday,
			// weekdayZ: monthEnd.weekday,
			// paddingA: monthStart.weekday - 1,
			// paddingZ: 7 - monthEnd.weekday
		}
		
		return info;
	}
}

// Export singleton instance
export default CalendarMakerSrv.getInstance();

