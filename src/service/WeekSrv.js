import store from '@/store';
import { nrm } from "@/utils/core-utils";

/**
 * WeekSrv manages the organization and presentation of week-based data in the application.
 * 
 * This service handles:
 * - Retrieving and organizing week and day data from the store
 * - Creating formatted week options with start and end dates
 * - Managing week boundaries and date formatting
 * - Providing a singleton instance for consistent week data access
 * 
 * Key Features:
 * - Maintains a list of weeks and days sorted by date
 * - Formats dates into user-friendly strings (DD/MM/YYYY)
 * - Provides week options with formatted labels (e.g., "10/04/2025 - 14/04/2025")
 * - Allows retrieval of week boundaries by week ID
 * 
 * The controller uses a singleton pattern to ensure consistent data access
 * across the application and maintains hydrated week data for efficient
 * retrieval of week information.
 */

class WeekSrv {
	static #instance = null; // Private static field
	
	hydratedWeeks = []
	
	constructor() {
		if (WeekSrv.#instance) {
			throw new Error('WeekSrv is a singleton. Use getInstance() instead.');
		}

		WeekSrv.#instance = this;
	}
	
	static getInstance() {
		if (!WeekSrv.#instance) {
			WeekSrv.#instance = new WeekSrv();
		}
		return WeekSrv.#instance;
	}
	
	// =============================================
	// PUBLIC
	// =============================================
	
	getWeekOptions() {
		this.hydratedWeeks = [];
		for (const w of this._getWeekItems()) {
			this._makeWeekOption(w);
		}
		
		console.log("this.hydratedWeeks", this.hydratedWeeks)
		return this.hydratedWeeks;
		
		/*
		[
				{
						"id": 1,
						"label": "07/04/2025 - 10/04/2025"
				},
				{
						"id": 2,
						"label": "14/04/2025 - 18/04/2025"
				}
		]
		 */
	}
	
	getWeekLimitsById(weekId) {
		const hw = this.hydratedWeeks.find(w => w.id === Number(weekId))
		
		return {
			start: hw ? hw.dayStart : null,
			end: hw ? hw.dayEnd : null,
		}
		
	}
	
	// =============================================
	// PRIVATE LOGIC
	// =============================================
	
	_makeWeekOption(week) {
		const hw = this._getHydratedWeek(week)
		this._parseWeekLabel(hw);
		
		const { id, label, dayStart, dayEnd } = hw;
		
		this.hydratedWeeks.push({ id, label, dayStart, dayEnd });
	}
	
	
	_getHydratedWeek(week) {
		const { id, days } = week;
		const hw = {
			id,
			days: []
		}
		
		const dayIds = days.split(":");
		
		for (const dayId of dayIds) {
			const day = this._getDayItems().find(d => d.id === Number(dayId));
			if (day) hw.days.push(nrm(day));
		}
		
		return hw;
	}
	
	_parseWeekLabel(hydratedWeek) {
		const id = hydratedWeek.id;
		
		const sortedDays = hydratedWeek.days.sort((a, b) => a.date.localeCompare(b.date));
		
		const s = sortedDays.at(0).date;
		const e = sortedDays.at(-1).date;
		
		hydratedWeek.dayStart = s; // "2025-04-10@00:00"
		hydratedWeek.dayEnd = e;
		
		const start = this._formatDate(s); // "10/04/2025"
		const end = this._formatDate(e);

		// hydratedWeek.label = `(${id}) ${start} - ${end}`;
		hydratedWeek.label = `${start} - ${end}`;
	}
	
	_formatDate(dtString) {
		const datePart = this._getDatePart(dtString);
		const [y, m, d] = datePart.split("-");
		return `${d}/${m}/${y}`;
	}
	
	_getDatePart(dtString) {
		const parts = dtString.split("@");
		return parts[0];
	}
	
	// =============================================
	// READ FROM STORE
	// =============================================
	
	_getWeekItems() {
		return this._getItems("week");
	}
	
	_getDayItems() {
		const days = this._getItems("day");
		days.sort((a, b) => a.date.localeCompare(b.date));
		return days;
	}
	
	_getItems(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName);
	}

}

export const weekSrv = WeekSrv.getInstance();
