
// processes the list and add 'hasTwin' property
function markMultiples(list) {
	const idCount = list.reduce((acc, el) => {
		acc[el.id] = (acc[el.id] || 0) + 1;
		return acc;
	}, {});
	
	return list.map(el => ({
		...el,
		hasTwin: idCount[el.id] > 1
	}));
}

// Then:
// const enrichedList = markTwins(rawList);
// const order = new AppOrder(enrichedList[0]);


/*
status can be "PENDING" - "EXECUTED"
type can be "TEST" - "REAL"
actions can be "DELETE" - "GOTO REAL" - "EXECUTE"
 */

const ACTIONS = {
	$open: "OPEN",
	$del: "DELETE",
	$goto: "GOTO REAL",
	$exec: "EXECUTE",
}

export class AppOrder {
	
	constructor(
		{ id, type, status, total },
		list // FIXME -- this can be avoided if preprocessing with markMultiples() is done
	) {
		this.id = id;
		this.type = type;
		this.status = status;
		this.total = total;
		
		// FIXME -- this can be avoided if preprocessing with markMultiples() is done
		this.hasTwin = list.filter(el => el.id === id).length > 1;
	}
	
	
	get actions() {
		const allowed = {
			$del: this.status !== "EXECUTED",
			$goto: this.type === "TEST" && !this.hasTwin,
			$exec: this.status === "PENDING",
			$open: true,
		}
		
		return Object.keys(ACTIONS)
			.filter(actionKey => allowed[actionKey])
			.map(key => ACTIONS[key]);
	}
	
}