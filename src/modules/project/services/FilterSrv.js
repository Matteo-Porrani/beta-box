/*
Example of PredefinedFilter entity
{
    id: 3,
    order: 2
    name: "Phase A - Sorted by title",

    sortByCol: "title",
    sortAsc: true,
    
    filterByCol: "topic",
    filterNeedle: "Functionality",
}
 */

import EntitySrv from "@/modules/core/services/EntitySrv";

class FilterSrv {
	
	static #instance;
	
	static getInstance() {
		if (!FilterSrv.#instance) {
			FilterSrv.#instance = new FilterSrv();
		}
		return FilterSrv.#instance;
	}
	
	
	/**
	 *
	 * @returns { { id: number, label: string, default: boolean  } }
	 */
	getFilterOpts() {
		const opts = this.getFilters().map(opt => {
			const { id, name } = opt;
			return {
				value: id,
				label: name,
				default: false,
				// ...rest
			}
		})
		opts.unshift({
			value: 0,
			label: "---",
			default: true,
		})
		return opts;
	}
	
	getFilters() {
		return EntitySrv.getItems("predefined_filter")
			.sort((a, b) => a.order - b.order);
	}
	
	getFilterById(id) {
		return this.getFilters().find(f => f.id === id)
	}
	
}


export default FilterSrv.getInstance();

