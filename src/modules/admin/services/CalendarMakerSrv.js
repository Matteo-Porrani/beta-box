// noinspection JSAnnotator

/*

A) take sourceDate ( ex: 2025-01-17 )
B) take 1st & last day of month
C) compute padding start & end (number of days) based on weekdays
D) get count of total days -> then rows
E)



 01   02   03
[XX] [XX] [AA] [AA] [AA] [AA] [AA]
[AA] [AA] [AA] [AA] [AA] [AA] [AA]


[ header ] [ body ] [ footer ]


 */




import { DateTime } from "luxon";



class CalendarMakerSrv {
	
	static #instance;
	
	static getInstance() {
		if (!CalendarMakerSrv.#instance) {
			CalendarMakerSrv.#instance = new CalendarMakerSrv();
		}
		return CalendarMakerSrv.#instance;
	}
	
	// =============================================
	
	
	parseCalendarTable(originDate) {
		const { cellsCount, tableA, monthName, monthNumber, monthYear } = this.getInfoFromOriginDate(originDate)
		
		const days = [];
		
		for (let i = 0; i < cellsCount; i++) {
			const day = tableA.plus({ days: i });
			const isPadding = day.month !== monthNumber;
			const isToday = day.toISODate() === DateTime.now().toISODate();
			days.push({
				"date": day.toISODate(),
				"isPadding": isPadding,
				"isToday": isToday
			})
		}
		
		return { monthName, monthYear, days }
	}
	
	
	getInfoFromOriginDate(originDate) {
		
		const origin = DateTime.fromISO(originDate);
		
		console.log(origin)
		console.log(origin.toString()) // 2025-01-01T00:00:00.000+01:00
		
		const monthStart = origin.startOf("month");
		const monthEnd = origin.endOf("month");
		
		const info = {
			cellsCount: monthStart.daysInMonth + (monthStart.weekday - 1) + (7 - monthEnd.weekday),
			tableA: monthStart.startOf("week"),
			monthNumber: monthStart.month,
			monthName: monthStart.toFormat("MMMM"),
			monthYear: monthStart.toFormat("yyyy"),
			
			// monthA: monthStart.toISODate(),
			// monthZ: monthEnd.toISODate(),
			// tableZ: monthEnd.endOf("week").toISODate(),
			// daysInMonth: origin.daysInMonth,
			// weekdayA: monthStart.weekday,
			// weekdayZ: monthEnd.weekday,
			// paddingA: monthStart.weekday - 1,
			// paddingZ: 7 - monthEnd.weekday
		}
		
		// console.table(info)
		
		return info;
		
	}
}


export default CalendarMakerSrv.getInstance();

