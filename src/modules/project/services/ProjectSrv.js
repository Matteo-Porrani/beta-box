// services
import EntitySrv from "@/modules/core/services/EntitySrv";
import SearchSrv from "@/modules/core/services/SearchSrv";
import HydrationSrv from "@/modules/core/services/HydrationSrv";
// utils
import { formatDurationFromMin, nrm } from "@/modules/core/utils/core-utils";
import { sortRows } from "@/modules/core/utils/table-utils";
import { convertFromAppDateFormatToStdFormat, splitDurationIntoHourPercents } from "@/modules/core/utils/date-utils";

class ProjectSrv {
	
	static #instance;
	
	static getInstance() {
		if (!ProjectSrv.#instance) {
			ProjectSrv.#instance = new ProjectSrv();
		}
		
		return ProjectSrv.#instance;
	}
	
	// =============================================
	
	getSrcTickets() {
		return nrm(EntitySrv.getItems("ticket"));
	}
	
	
	getTickets(sortByCol, sortAsc, needle, filterByCol, { showActive, showInactive }) {
		const desc = this.#getTicketEntityDescription();
		const tickets = nrm(EntitySrv.getItems("ticket"));
		
		let hydratedTickets = tickets.reduce((a, t) => {
			a.push(HydrationSrv.hydrateObject(t, desc))
			return a;
		}, [])
		
		sortRows(hydratedTickets, sortByCol, sortAsc);
		
		// filter on "active" key
		if (showActive && !showInactive) hydratedTickets = hydratedTickets.filter(t => t.active);
		if (!showActive && showInactive) hydratedTickets = hydratedTickets.filter(t => !t.active);
		
		return needle
			? SearchSrv.filterObjectsByNeedle(hydratedTickets, needle, filterByCol)
			: hydratedTickets;
	}
	
	getTicketById(id) {
		const tickets = this.getTickets("id", true, "", null, { showActive: true, showInactive: true});
		const t = tickets.find(t => t.id === Number(id));
		const { activities, totalDuration } = this.#getActivitiesByTicketId(id);
		
		return {
			...t,
			activity: {
				total: totalDuration,
				items: activities,
			}
		}
	}
	
	#getActivitiesByTicketId(id) {
		let activities = EntitySrv.getItems("activity")
			.filter(a => Number(a.tickets) === Number(id));
		
		const totalDuration = activities.reduce((acc, act) =>{
			acc += Number(act.duration);
			return acc;
		}, 0);
		
		activities = activities.map(a => {
			const dayDate = this.#getDayDateById(Number(a.day))
			return {
				day: convertFromAppDateFormatToStdFormat(dayDate),
				duration: formatDurationFromMin(a.duration),
				durationBlocks: splitDurationIntoHourPercents(a.duration),
			}
		})
		
		return {
			activities,
			totalDuration: formatDurationFromMin(totalDuration)
		}
	}
	
	#getDayDateById(id) {
		const days = EntitySrv.getItems("day");
		return days.find(d => d.id === Number(id)).date
	}
	
	#getTicketEntityDescription() {
		return EntitySrv.getEntityDescription("ticket");
	}
}

export default ProjectSrv.getInstance();
