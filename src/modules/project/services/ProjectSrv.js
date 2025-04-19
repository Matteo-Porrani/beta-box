// services
import EntitySrv from "@/modules/core/services/EntitySrv";
import SearchSrv from "@/modules/core/services/SearchSrv";
import HydrationSrv from "@/modules/core/services/HydrationSrv";
// utils
import { nrm } from "@/modules/core/utils/core-utils";
import { sortRows } from "@/modules/core/utils/table-utils";

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
	
	#getTicketEntityDescription() {
		return EntitySrv.getEntityDescription("ticket");
	}
}

export default ProjectSrv.getInstance();
