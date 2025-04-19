class SingleSrv {
	
	static #instance;
	
	static getInstance() {
		if (!SingleSrv.#instance) {
			SingleSrv.#instance = new SingleSrv();
		}
		return SingleSrv.#instance;
	}

	// ...
}


export default SingleSrv.getInstance();

