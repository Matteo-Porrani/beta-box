import store from "@/store";
import { nrm } from "@/modules/core/utils/core-utils";
import { filterTableByNeedle } from "@/modules/core/utils/table-utils";

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
	
	getTickets(sortKey = "title", sortOrder, needle) {
		const tickets = nrm(this._getTicketItems());
		
		for (const t of tickets) {
			this._hydrateTicket(t);
		}
		
		this._sortBy(tickets, sortKey, sortOrder)
		
		return needle
			? filterTableByNeedle(tickets, needle)
			: tickets;
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
		
		if (t.status) {
			t.hydratedStatus = this._getHydratedStatus(t.status)
		}
		
	}
	
	_getHydratedStatus(statusId) {
		const s = this._getStatusObject(statusId);
		
		if (s.color) {
			s.color = this._getColorObject(Number(s.color));
		}
		
		return s;
	}
	
	// =============================================
	// GET OBJECTS
	// =============================================
	
	_getTopicObject(topicId) { // must be single
		return nrm(this._getTopicItems().find(t => t.id === Number(topicId))) ?? null;
	}
	
	_getStatusObject(statusId) { // must be single
		return nrm(this._getStatusItems().find(t => t.id === Number(statusId))) ?? null;
	}
	
	_getColorObject(colorId) { // must be single
		return nrm(this._getColorItems().find(t => t.id === Number(colorId))) ?? null;
	}
	
	_getSprintObject(sprintId) { // must be single
		return nrm(this._getSprintItems().find(t => t.id === Number(sprintId))) ?? null;
	}
	
	// =============================================
	// SORTING
	// =============================================
	
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
	
	_getStatusItems() {
		// id, name
		return this._getItems("status");
	}
	
	_getColorItems() {
		// id, name
		return this._getItems("color");
	}
	
	// =============================================
	// ROOT METHOD
	// =============================================
	
	_getItems(tableName) {
		return store.getters["entity/getItemsFromTable"](tableName);
	}
	
}

export default ProjectSrv.getInstance();
