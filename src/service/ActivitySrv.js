import store from '@/store';
import { nrm } from "@/utils/core-utils";

class ActivitySrv {
	static instance;

	static getInstance() {
		if (!ActivitySrv.instance) {
			ActivitySrv.instance = new ActivitySrv();
		}
		return ActivitySrv.instance;
	}

	getActivities() {
		const days = this._getDays();
		return this._hydrateDays(days);
	}
	
	// =============================================
	// DATA RETRIEVAL
	// =============================================

	_getDays() {
		// this is the format of the days:
		// [{"date":"2025-04-07@00:00","id":1},{"date":"2025-04-08@00:00","id":2}]
		
		if (!store?.state?.entity?.entities?.day) return [];
		
		return store.state.entity.entities.day;
	}
	
	_getTicketTitles(ticketIds) {
		// 1. Handle empty case
		if (!ticketIds) return [];
		
		// 2. Split the ticketIds string into array
		// "1:2:4" -> ["1", "2", "4"]
		const ids = ticketIds.split(':');
		
		// 3. Get tickets from store
		// Handle case where store or entities.ticket might be undefined
		const tickets = store?.state?.entity?.entities?.ticket || [];
		
		// 4. Map through IDs and find corresponding titles
		// Handle cases where ticket ID doesn't exist in store
		// Return only the titles that were found
		return ids
			.map(id => tickets.find(t => t.id.toString() === id)?.title)
			.filter(title => title !== undefined);
		
		// 5. Return array of titles
		// ["RDTW-1234", "6543", "444"]
	}

	_hydrateDays(days) {
		// this is the format of the activities:
		// [{"type":"$D","day":"1","description":"hello","tickets":"1","duration":120,"id":14},{"type":"$R","day":"1","description":"daily","url":"localhost:8080/activity","tickets":"","duration":30,"id":15}]

		return days.map(day => {
			const activities = store?.state?.entity?.entities?.activity?.filter(
				activity => activity.day === day.id.toString()
			) || [];

			// First format durations
			const activitiesWithDuration = activities.map(activity => ({
				...activity,
				duration: this._formatDuration(activity.duration)
			}));

			// Then hydrate with ticket titles
			const hydratedActivities = this._hydrateActivities(activitiesWithDuration);
			

			return {
				...day,
				formattedDate: this._formatDate(day.date),
				totalDuration: this._calculateTotalDuration(activities),
				activities: hydratedActivities,
				parts: this._parseTypesBar(nrm(activities))
			};
		});
	}
	
	_hydrateActivities(activities) {
		/*
		This is the format of activities,
		we need to retrieve the 'title' of each linked ticket.
		
		"1:2:4" means that the activity is linked to 3 tickets, with id 1, 2, and 4.
		We should add a new property 'ticketTitles' which is an array containing the titles,
		for example ["1234", "5678"... ]
		
        "activities": [
            {
                "type": "$D",
                "day": "1",
                "description": "hello",
                "tickets": "1:2:4",
                "duration": "02:00",
                "id": 14,
                "url": "http://localhost:8080/admin"
            },
            {
                "type": "$R",
                "day": "1",
                "description": "daily",
                "tickets": "",
                "duration": "00:30",
                "id": 15
            },
            {
                "type": "$A",
                "day": "1",
                "description": "estimation",
                "duration": "00:30",
                "tickets": "4",
                "id": 17
            }
        ]
		*/
		
		return activities.map(activity => ({
			...activity,
			ticketTitles: this._getTicketTitles(activity.tickets)
		}));
	}
	
	// =============================================
	// UTILITY
	// =============================================
	
	getLabelFromActivityCode(code) {
		return store.getters["entity/getLabelFromListValue"]("$activity_type", code);
	}
	
	_formatDate(dateString) {
		const date = new Date(dateString.replace('@', 'T'));
		const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		
		return `${days[date.getDay()]} - ${months[date.getMonth()]} ${date.getDate()}`;
	}
	
	_formatDuration(minutes) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
	}
	
	_calculateTotalDuration(activities) {
		const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration, 0);
		return this._formatDuration(totalMinutes);
	}
	
	_parseTypesBar(activities) {
		const parts = {};
		
		["$D", "$R", "$O", "$A", "$E"].forEach(t => {
			const typedActivities = activities.filter(a => a.type === t);
			parts[t] = this._sumActivitiesByType(typedActivities);
		})
		
		// Step 1: Compute the total sum based on all positive values
		const total = Object.values(parts).reduce((sum, value) =>
			value > 0 ? sum + value : sum, 0
		);

		// Step 2: Create a new object with percentage values
		return Object.fromEntries(
			Object.entries(parts).map(([key, value]) => [
				key,
				total > 0 ? parseFloat(((value / total) * 100).toFixed(2)) : 0
			])
		);
	}
	
	_sumActivitiesByType(typedActivities) {
		return typedActivities.reduce((acc, act) => {
			acc += act.duration;
			return acc;
		}, 0)
	}
}

export const activitySrv = ActivitySrv.getInstance();

