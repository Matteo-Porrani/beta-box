import { isFalsy } from "@/utils/core-utils";

export function prepareItem(srcObject) {
	console.log("___ prepareItem ___", srcObject)
	const o = {};
	
	for (const key of Object.keys(srcObject)) {
		console.log(key, srcObject[key])
		if (!isFalsy(srcObject[key])) {
			o[key] = srcObject[key];
		}
	}
	
	return o;
}

