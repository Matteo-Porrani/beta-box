class TodoGridSrv {
	static #instance = null; // Private static field
	
	constructor() {
		if (TodoGridSrv.#instance) {
			throw new Error('TodoGridSrv is a singleton. Use getInstance() instead.');
		}
		
		TodoGridSrv.#instance = this;
	}
	
	static getInstance() {
		if (!TodoGridSrv.#instance) {
			TodoGridSrv.#instance = new TodoGridSrv();
		}
		return TodoGridSrv.#instance;
	}
	
}

export const TodoGridSrv = TodoGridSrv.getInstance();

