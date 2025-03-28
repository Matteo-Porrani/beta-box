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

