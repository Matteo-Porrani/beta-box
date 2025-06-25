import { describe, it, expect } from "vitest";
import moment from "moment";
import { buildTimeRange } from "@/modules/core/utils/date-utils";

describe("buildTimeRange", () => {
	// Functional Tests
	it("builds 3 days forward", () => {
		const result = buildTimeRange({
			unit: "day",
			count: 3,
			start: "2025-05-01",
		});
		expect(result).toEqual(["2025-05-01", "2025-05-02", "2025-05-03"]);
	});
	
	it("builds 3 months backward", () => {
		const result = buildTimeRange({
			unit: "month",
			count: -3,
			start: "2025-03",
		});
		expect(result).toEqual(["2025-03", "2025-02", "2025-01"]);
	});
	
	it("builds 5 years forward", () => {
		const result = buildTimeRange({
			unit: "year",
			count: 5,
			start: "2025",
		});
		expect(result).toEqual(["2025", "2026", "2027", "2028", "2029"]);
	});
	
	it("handles year boundary when going forward in months", () => {
		const result = buildTimeRange({
			unit: "month",
			count: 3,
			start: "2025-11",
		});
		expect(result).toEqual(["2025-11", "2025-12", "2026-01"]);
	});
	
	// Validation & Edge Cases
	it("returns empty array when count is 0", () => {
		const result = buildTimeRange({
			unit: "day",
			count: 0,
			start: "2025-01-01",
		});
		expect(result).toEqual([]);
	});
	
	it("throws for unsupported unit", () => {
		expect(() =>
			buildTimeRange({
				unit: "hour",
				count: 3,
				start: "2025-01-01",
			})
		).toThrow(/Invalid unit/);
	});
	
	it("throws if count is not an integer", () => {
		expect(() =>
			buildTimeRange({
				unit: "day",
				count: 2.5,
				start: "2025-01-01",
			})
		).toThrow(/must be an integer/);
	});
	
	it("throws for invalid start date format", () => {
		expect(() =>
			buildTimeRange({
				unit: "month",
				count: 2,
				start: "25-05", // invalid format for "YYYY-MM"
			})
		).toThrow(/Invalid start date/);
	});
	
	// Format Fidelity
	it("preserves leading zeros in days", () => {
		const result = buildTimeRange({
			unit: "day",
			count: 2,
			start: "2025-03-09",
		});
		expect(result).toEqual(["2025-03-09", "2025-03-10"]);
	});
	
	// Purity Check
	it("does not mutate input moment object", () => {
		const m = moment("2025-01-01");
		const original = m.clone();
		
		buildTimeRange({
			unit: "day",
			count: 2,
			start: m.format("YYYY-MM-DD"),
		});
		
		expect(m.isSame(original)).toBe(true);
	});
});
