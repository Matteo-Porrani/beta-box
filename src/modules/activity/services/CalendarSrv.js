import store from "@/store";
import EntitySrv from "@/modules/core/services/EntitySrv";
import DateHelperSrv from "@/modules/core/services/DateHelperSrv";


class CalendarSrv {
	
	static #instance;
	
	static getInstance() {
		if (!CalendarSrv.#instance) {
			CalendarSrv.#instance = new CalendarSrv();
		}
		return CalendarSrv.#instance;
	}
	
	// ============================================= WEEK & DAYS GENERATION
	
	/**
	 * Generates a week of calendar data by creating individual days and linking them together
	 * Creates a new day entry for each date in the range and links them in a week entry
	 *
	 * If start & end are the same date, it will create a week with a single day
	 * 
	 * @param {Object} params - Parameters object
	 * @param {string} params.start - Start date in format "YYYY-MM-DD@HH:MM"
	 * @param {string} params.end - End date in format "YYYY-MM-DD@HH:MM"
	 * @returns {Promise<void>} Promise that resolves when the week and its days are created
	 * @throws {Error} If end date is before start date
	 */
	async generateWeek({ start, end }) {
		
		if (DateHelperSrv.dateIsBefore(end, start)) {
			console.log("INVALID DATES");
			return;
		}
		
		const interval = DateHelperSrv.generateContinuousDates(start, end)
		
		const newDays = [];
		for (const d of interval) {
			const newId = await this.#insertDay(d);
			newDays.push(newId)
		}
		
		await this.#insertWeek(newDays);
	}
	
	async #insertWeek(newDays) {
		await this.#insertItem({
			tableName: "week",
			item: {
				days: newDays.join(":"),
				// comment: `auto creation @ ${new Date().getTime()}`
			}
		})
	}
	
	async #insertDay(stringDate) {
		const res = await this.#insertItem({
			tableName: "day",
			item: { date: stringDate }
		})
		
		return res.itemId;
	}
	
	async #insertItem({ tableName, item }) {
		return await store.dispatch("entity/addItem", { tableName, item })
	}
	
	// ============================================= DATA RETRIEVAL
	
	getWeeks() {
		const weeks = this.#getItems("week")
		
		weeks.forEach(w => {
			const days = w.days.split(":");
			w.daysFormatted = days.map(dId => this.#getDayById(dId))
		})
		
		return weeks;
	}
	
	getDays() {
		return this.#getItems("day")
	}
	
	#getDayById(id) {
		const day = EntitySrv.getItemById("day", id);
		
		return {
			...day,
			dateFormatted: DateHelperSrv.getFormattedDate(day.date).replaceAll(".", "")
		}
	}
	
	
	// ============================================= GENERIC RETRIEVAL METHOD
	#getItems(tableName) {
		return EntitySrv.getItems(tableName)
	}
	
}


export default CalendarSrv.getInstance();

