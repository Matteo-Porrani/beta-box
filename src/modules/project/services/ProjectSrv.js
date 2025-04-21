// services
import EntitySrv from "@/modules/core/services/EntitySrv";
import TableSrv from "@/modules/core/services/TableSrv";
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
	
	getTickets(sortByCol, sortAsc, needle, filterByCol, { showActive, showInactive }) {
		const desc = this.#getTicketEntityDescription();
		
		// hydratedTickets
		let ht = this.#getTicketItems().map(t => {
			return HydrationSrv.hydrateObject(t, desc)
		});
		
		// retrieve liste labels
		ht = TableSrv.getListLabels(ht, "Ticket");
		// filter on active / inactive
		ht = this.#applyActiveInactiveFilter(ht, showActive, showInactive)
		// sort
		sortRows(ht, sortByCol, sortAsc);
		
		// filter on custom needle
		return needle
			? SearchSrv.filterObjectsByNeedle(ht, needle, filterByCol)
			: ht;
	}
	
	getSrcTicketCloneById(id) {
		const t = this.#getTicketItems().find(t => Number(t.id) === Number(id))
		return nrm(t);
	}
	
	getTicketById(id) {
		const tickets = this.getTickets("id", true, "", null, { showActive: true, showInactive: true});
		const t = tickets.find(t => Number(t.id) === Number(id));

		const { activities, totalDuration } = this.#getActivitiesByTicketId(id);
		const notes = this.#getNotesByTicketId(id);
		
		return {
			...t,
			activity: {
				total: totalDuration,
				items: activities,
			},
			notes,
		}
	}
	
	#applyActiveInactiveFilter(hydratedTickets, showA, showI) {
		if (showA && !showI) hydratedTickets = hydratedTickets.filter(t => t.active);
		if (!showA && showI) hydratedTickets = hydratedTickets.filter(t => !t.active);
		return hydratedTickets;
	}
	
	// ============================================= NOTES, ACTIVITY, DAY
	
	#getNotesByTicketId(id) {
		return EntitySrv.getItems("note")
			.filter(a => Number(a.ticket) === Number(id));
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
		return this.#getDayItems()
			.find(d => d.id === Number(id)).date
	}
	
	// ============================================= DESCRIPTION
	
	#getTicketEntityDescription() {
		return EntitySrv.getEntityDescription("ticket");
	}
	
	// ============================================= SOURCE ITEMS
	#getTicketItems() {
		return nrm(EntitySrv.getItems("ticket"));
	}
	
	#getDayItems() {
		return nrm(EntitySrv.getItems("day"));
	}
}

export default ProjectSrv.getInstance();
