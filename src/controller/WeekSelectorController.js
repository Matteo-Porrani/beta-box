import store from '@/store';
import { nrm } from "@/utils/core-utils";

/**
 * WeekSelectorController manages the organization and presentation of week-based data in the application.
 * 
 * This controller handles:
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

class WeekSelectorController {
	static #instance = null; // Private static field
	
	constructor() {
		if (WeekSelectorController.#instance) {
			throw new Error('WeekSelectorController is a singleton. Use getInstance() instead.');
		}
		this.weeks = this._getWeekItems();
		this.days = this._getDayItems().sort((a, b) => a.date.localeCompare(b.date));
		this.hydratedWeeks = [];
		WeekSelectorController.#instance = this;
	}
	
	static getInstance() {
		if (!WeekSelectorController.#instance) {
			WeekSelectorController.#instance = new WeekSelectorController();
		}
		return WeekSelectorController.#instance;
	}
	
	// =============================================
	// PUBLIC
	// =============================================
	
	getWeekOptions() {
		this.hydratedWeeks = [];
		for (const w of this.weeks) {
			this._makeWeekOption(w);
		}
		
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
		
		if (hw) {
			return {
				start: hw.dayStart,
				end: hw.dayEnd,
			}
		}
		
		return {
			start: null,
			end: null,
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
			const day = this.days.find(d => d.id === Number(dayId));
			if (day) hw.days.push(nrm(day));
		}
		
		return hw;
	}
	
	_parseWeekLabel(hydratedWeek) {
		const id = hydratedWeek.id;
		
		const s = hydratedWeek.days.sort((a, b) => a.date.localeCompare(b.date)).at(0).date;
		const e = hydratedWeek.days.sort((a, b) => a.date.localeCompare(b.date)).at(-1).date;
		
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

export const weekSelectorController = WeekSelectorController.getInstance();
