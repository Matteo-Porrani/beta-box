import { isNullOrUndefined } from "@/utils/core-utils";

export function prepareItem(srcObject) {
	const o = {};
	
	for (const key of Object.keys(srcObject)) {
		console.log(key, srcObject[key])
		if (key === "id" && isNullOrUndefined(srcObject[key])) {
			continue;
		}
		o[key] = srcObject[key];
	}
	
	return o;
}

export function getPickerColsFromDef(def) {
	return def.reduce((acc, defEntry) => {
		console.log("--", defEntry.field, defEntry.picker_col)
		if (defEntry.picker_col === true) {
			console.log("...pushing", defEntry.field)
			acc.push(defEntry.field);
		}
		return acc;
	}, [])
}

