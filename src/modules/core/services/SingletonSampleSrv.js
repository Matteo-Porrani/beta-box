class SingletonSampleSrv {
	
	static #instance;
	
	static getInstance() {
		if (!SingletonSampleSrv.#instance) {
			SingletonSampleSrv.#instance = new SingletonSampleSrv();
		}
		return SingletonSampleSrv.#instance;
	}

	// ...
}


export default SingletonSampleSrv.getInstance();

