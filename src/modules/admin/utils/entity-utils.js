import { isNullOrUndefined } from "@/modules/core/utils/core-utils";

export function prepareItem(srcObject) {
	const o = {};
	
	for (const key of Object.keys(srcObject)) {
		if (key === "id" && isNullOrUndefined(srcObject[key])) {
			continue;
		}
		o[key] = srcObject[key];
	}
	
	return o;
}

export function getPickerColsFromDef(def) {
	return def.reduce((acc, defEntry) => {
		if (defEntry.picker_col === true) {
			acc.push(defEntry.field);
		}
		return acc;
	}, [])
}

