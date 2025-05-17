class DateHelperSrv {
	
	static #instance;
	
	static getInstance() {
		if (!DateHelperSrv.#instance) {
			DateHelperSrv.#instance = new DateHelperSrv();
		}
		return DateHelperSrv.#instance;
	}

	// ...
}


export default DateHelperSrv.getInstance();

