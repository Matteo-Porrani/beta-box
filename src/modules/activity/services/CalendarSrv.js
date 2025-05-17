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
	
	// ============================================= SECTION
	
	async generateWeek({ start, end }) {
		console.log("******** generateWeek ********", start, end)
		
		const interval = DateHelperSrv.generateContinuousDates(start, end)
		console.log("interval", interval)
		
		const newDays = [];
		
		for (const d of interval) {
			console.log("...creating", d)
			const newId = await this.#insertDay(d);
			newDays.push(newId)
		}
		
		console.log("...DAYS CREATION DONE")
		console.log("newDays", newDays)
		
		await this.#insertWeek(newDays);

	}
	
	
	async #insertWeek(newDays) {
		const newWeekId = await this.#insertItem({
			tableName: "week",
			item: {
				days: newDays.join(":"),
				// comment: `auto creation @ ${new Date().getTime()}`
			}
		})
		
		console.log("newDayId", newWeekId)
		return newWeekId;
	}
	
	async #insertDay(stringDate) {
		const res = await this.#insertItem({
			tableName: "day",
			item: { date: stringDate }
		})
		
		console.log("res", res)
		return res.itemId;
	}
	
	
	async #insertItem({ tableName, item }) {
		return await store.dispatch("entity/addItem", { tableName, item })
	}
	
	
	
	// =============================================
	
	getWeeks() {
		const weeks = this.#getItems("week")
		
		weeks.forEach(w => {
			const days = w.days.split(":");
			w.daysFormatted = days.map(dId => this.getDayById(dId))
		})
		
		return weeks;
	}
	
	getDays() {
		return this.#getItems("day")
	}
	
	getDayById(id) {
		const day = EntitySrv.getItemById("day", id);
		
		return {
			...day,
			dateFormatted: DateHelperSrv.getFormattedDate(day.date).replaceAll(".", "")
		}
	}
	
	
	// ============================================= SECTION
	#getItems(tableName) {
		return EntitySrv.getItems(tableName)
	}
	
}


export default CalendarSrv.getInstance();

