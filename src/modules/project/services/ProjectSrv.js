import store from "@/store";
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
	// MAIN
	// =============================================
	
	getTickets(sortKey = "title") {
		const tickets = nrm(this._getTicketItems());
		
		for (const t of tickets) {
			console.log("ticket", t.title)
			this._hydrateTicket(t);
		}
		
		this._sortBy(tickets, sortKey, 0)
		
		console.log("TICKETS", tickets)
		
		return tickets;
	}
	
	_hydrateTicket(t) {
		
		if (t.sprint) {
			t.hydratedSprint = [];
			for (const sId of t.sprint.split(":")) {
				t.hydratedSprint.push(this._getSprintObject(sId))
			}
		}
		
		if (t.topic) {
			t.hydratedTopic = this._getTopicObject(t.topic)
		}
		
	}
	
	_getTopicObject(topicId) { // must be single
		return nrm(this._getTopicItems().find(t => t.id === Number(topicId))) ?? null;
	}
	
	_getSprintObject(sprintId) { // must be single
		return nrm(this._getSprintItems().find(t => t.id === Number(sprintId))) ?? null;
	}
	
	// =============================================
	// SEPARATOR
	// =============================================
	
	_sortBy(rows, byKey, order) {
		const sortedRows = rows.sort((a, b) => {
			const valA = a[byKey];
			const valB = b[byKey];
			
			// If both values are numbers, compare numerically
			if (!isNaN(valA) && !isNaN(valB)) {
				return Number(valA) - Number(valB);
			}
			
			// Otherwise, compare as strings
			return String(valA).localeCompare(String(valB));
		});
		
		if (order > 0) sortedRows.reverse();
		return sortedRows;
	}
	
	
	// =============================================
	// UTILITY
	// =============================================
	
	_getTicketItems() {
		return this._getItems("ticket");
	}
	
	_getTopicItems() {
		// id, name, color
		return this._getItems("topic");
	}
	
	_getSprintItems() {
		// id, name
		return this._getItems("sprint");
	}
	
	_getItems(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName);
	}
	
}

export const projectSrv = ProjectSrv.getInstance();
