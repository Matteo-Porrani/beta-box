import EntitySrv from "@/modules/core/services/EntitySrv";


class CalendarSrv {
	
	static #instance;
	
	static getInstance() {
		if (!CalendarSrv.#instance) {
			CalendarSrv.#instance = new CalendarSrv();
		}
		return CalendarSrv.#instance;
	}
	
	// =============================================
	
	getWeeks() {
		return this.#getItems("week")
	}
	
	getDays() {
		return this.#getItems("day")
	}
	
	
	// ============================================= SECTION
	#getItems(tableName) {
		return EntitySrv.getItems(tableName)
	}
	
}


export default CalendarSrv.getInstance();

