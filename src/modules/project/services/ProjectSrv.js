// services
import EntitySrv from "@/modules/core/services/EntitySrv";
import SearchSrv from "@/modules/core/services/SearchSrv";
import HydrationSrv from "@/modules/core/services/HydrationSrv";
// utils
import { nrm } from "@/modules/core/utils/core-utils";

class ProjectSrv {
	
	static #instance;
	
	static getInstance() {
		if (!ProjectSrv.#instance) {
			ProjectSrv.#instance = new ProjectSrv();
		}
		
		return ProjectSrv.#instance;
	}
	
	// =============================================
	
	getTickets(sortKey = "title", sortOrder, needle) {
		const desc = this.#getTicketEntityDescription();
		
		const tickets = nrm(EntitySrv.getItems("ticket"));
		
		const hydratedTickets = tickets.reduce((a, t) => {
			a.push(HydrationSrv.hydrateObject(t, desc))
			return a;
		}, [])
		
		this._sortBy(hydratedTickets, sortKey, sortOrder);
		
		return needle
			? SearchSrv.filterObjectsByNeedle(hydratedTickets, needle)
			: hydratedTickets;
	}
	
	_sortBy(rows, byKey, order) {
		rows.sort((a, b) => {
			const valA = a[byKey];
			const valB = b[byKey];
			
			// If both values are numbers, compare numerically
			if (!isNaN(valA) && !isNaN(valB)) {
				return Number(valA) - Number(valB);
			}
			
			// Otherwise, compare as strings
			return String(valA).localeCompare(String(valB));
		});
		
		if (Number(order) > 0) rows.reverse();
	}
	
	#getTicketEntityDescription() {
		return EntitySrv.getEntityDescription("ticket");
	}
}

export default ProjectSrv.getInstance();
