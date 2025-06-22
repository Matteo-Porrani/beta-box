import { describe, it, expect, beforeEach } from "vitest";
import { AppOrder } from "@/modules/core/services/samples/AppOrder";

const ORDERS = [
	{ id: 100, type: "TEST", status: "PENDING", total: 1200 }, // no twin
	{ id: 200, type: "TEST", status: "PENDING", total: 3450 },
	{ id: 200, type: "REAL", status: "PENDING", total: 3450 },
	{ id: 300, type: "TEST", status: "EXECUTED", total: 2300 }, // no twin
	{ id: 400, type: "TEST", status: "EXECUTED", total: 5400 },
	{ id: 400, type: "REAL", status: "EXECUTED", total: 5400 },
]

describe("01 - has authorized actions", () => {
	it("type is TEST, status is PENDING, and hasTwin 'false', expected OPEN, DELETE, GOTO READY, EXECUTE", () => {
		const ord = new AppOrder(
			{ id: 100, type: "TEST", status: "PENDING", total: 1200 }
			, ORDERS
		)
		expect(ord.actions).toEqual(["OPEN", "DELETE", "GOTO REAL", "EXECUTE"])
	})
	
	it("type is TEST, status is PENDING, and hasTwin 'true', expected OPEN, DELETE, EXECUTE", () => {
		const ord = new AppOrder(
			{ id: 200, type: "TEST", status: "PENDING", total: 3450 },
			ORDERS
		)
		expect(ord.actions).toEqual(["OPEN", "DELETE", "EXECUTE"])
	})
	
	it("type is REAL, status is PENDING, expected OPEN, DELETE, EXECUTE", () => {
		const ord = new AppOrder(
			{ id: 200, type: "REAL", status: "PENDING", total: 3450 },
			ORDERS
		)
		expect(ord.actions).toEqual(["OPEN", "DELETE", "EXECUTE"])
	})
	
	it("type is TEST, status is EXECUTED, and hasTwin 'false', expected OPEN, GOTO REAL", () => {
		const ord = new AppOrder(
			{ id: 300, type: "TEST", status: "EXECUTED", total: 3450 },
			ORDERS
		)
		expect(ord.actions).toEqual(["OPEN", "GOTO REAL"])
	})
	
	it("type is REAL, status is EXECUTED, and hasTwin 'true', expected OPEN", () => {
		const ord = new AppOrder(
			{ id: 400, type: "REAL", status: "EXECUTED", total: 5400 },
			ORDERS
		)
		expect(ord.actions).toEqual(["OPEN"])
	})

})


