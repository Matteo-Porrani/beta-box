
// utility defined as simple function, not exported
function parseEmployee(item) {
	const { id, firstName, lastName, location, hiredIn } = item;
	
	const seniority = (new Date().getFullYear()) - hiredIn;
	const { city, state } = location;
	
	return {
		id,
		fullName: `${lastName.toUpperCase()} ${firstName}`,
		seniority,
		site: `${state}-${city}`
	};
}

const IIFEServiceSample = (() => {
	let counter = 0; // internal state that doesn't need to be reactive
	
	return {
		increment() {
			counter++;
			return counter;
		},
		reset() {
			counter = 0;
		},
		refineComplexData(array) {
			return array.map(item => parseEmployee(item))
		},
		
		// expose "private" utilities for testing purposes
		_private: {
			parseEmployee
		}
	}
	
})();

export default IIFEServiceSample