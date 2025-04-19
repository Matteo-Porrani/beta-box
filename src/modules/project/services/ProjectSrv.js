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
	
	getTickets(sortByCol, sortAsc, needle, filterByCol) {
		const desc = this.#getTicketEntityDescription();
		
		const tickets = nrm(EntitySrv.getItems("ticket"));
		
		const hydratedTickets = tickets.reduce((a, t) => {
			a.push(HydrationSrv.hydrateObject(t, desc))
			return a;
		}, [])
		
		sortRows(hydratedTickets, sortByCol, sortAsc);
		
		return needle
			? SearchSrv.filterObjectsByNeedle(hydratedTickets, needle, filterByCol)
			: hydratedTickets;
	}
	
	// _sortBy(rows, byKey, order) {
	// 	rows.sort((a, b) => {
	// 		const valA = a[byKey];
	// 		const valB = b[byKey];
	//
	// 		// If both values are numbers, compare numerically
	// 		if (!isNaN(valA) && !isNaN(valB)) {
	// 			return Number(valA) - Number(valB);
	// 		}
	//
	// 		// Otherwise, compare as strings
	// 		return typeof valA === "object"
	// 			? String(valA?.id).localeCompare(String(valB?.id))
	// 			: String(valA).localeCompare(String(valB))
	// 	});
	//
	// 	if (Number(order) > 0) rows.reverse();
	// }
	
	#getTicketEntityDescription() {
		return EntitySrv.getEntityDescription("ticket");
	}
}

export default ProjectSrv.getInstance();
