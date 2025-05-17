import { describe, it, expect } from "vitest";
import DateHelperSrv from "../../../src/modules/core/services/DateHelperSrv";

describe("dateIsBefore", () => {
	it("should return true when date is before reference date", () => {
		const result = DateHelperSrv.dateIsBefore("2024-03-15@14:30", "2024-03-15@15:30");
		expect(result).toBe(true);
	});
	
	it("should return false when date is after reference date", () => {
		const result = DateHelperSrv.dateIsBefore("2024-03-15@16:30", "2024-03-15@15:30");
		expect(result).toBe(false);
	});
	
	it("should return false when dates are equal (default behavior)", () => {
		const result = DateHelperSrv.dateIsBefore("2024-03-15@15:30", "2024-03-15@15:30");
		expect(result).toBe(false);
	});
	
	it("should return true when dates are equal and acceptSameDate is true", () => {
		const result = DateHelperSrv.dateIsBefore("2024-03-15@15:30", "2024-03-15@15:30", true);
		expect(result).toBe(true);
	});
	
	it("should handle different days", () => {
		const result = DateHelperSrv.dateIsBefore("2024-03-14@23:59", "2024-03-15@00:00");
		expect(result).toBe(true);
	});
});


describe("dateIsAfter", () => {
	it("should return true when date is after reference date", () => {
		const result = DateHelperSrv.dateIsAfter("2024-03-15@16:30", "2024-03-15@15:30");
		expect(result).toBe(true);
	});

	it("should return false when date is before reference date", () => {
		const result = DateHelperSrv.dateIsAfter("2024-03-15@14:30", "2024-03-15@15:30");
		expect(result).toBe(false);
	});

	it("should return false when dates are equal (default behavior)", () => {
		const result = DateHelperSrv.dateIsAfter("2024-03-15@15:30", "2024-03-15@15:30");
		expect(result).toBe(false);
	});

	it("should return true when dates are equal and acceptSameDate is true", () => {
		const result = DateHelperSrv.dateIsAfter("2024-03-15@15:30", "2024-03-15@15:30", true);
		expect(result).toBe(true);
	});

	it("should handle different days", () => {
		const result = DateHelperSrv.dateIsAfter("2024-03-15@00:00", "2024-03-14@23:59");
		expect(result).toBe(true);
	});
});


describe("dateIsBetween", () => {
	it("should return true when date is between start and end dates", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@15:30", "2024-03-15@14:30", "2024-03-15@16:30");
		expect(result).toBe(true);
	});

	it("should return false when date is before start date", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-14@23:59", "2024-03-15@14:30", "2024-03-15@16:30");
		expect(result).toBe(false);
	});
    
	it("should return false when date is after end date", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@16:31", "2024-03-15@14:30", "2024-03-15@16:30");
		expect(result).toBe(false);
	});
    
	it("should return false when date is equal to start date (default behavior)", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@14:30", "2024-03-15@14:30", "2024-03-15@16:30");
		expect(result).toBe(false);
	});

	it("should return true when date is equal to start date and acceptSameDate is true", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@14:30", "2024-03-15@14:30", "2024-03-15@16:30", true);
		expect(result).toBe(true);
	});

	it("should return false when date is equal to end date (default behavior)", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@16:30", "2024-03-15@14:30", "2024-03-15@16:30");
		expect(result).toBe(false);
	});

	it("should return true when date is equal to end date and acceptSameDate is true", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@16:30", "2024-03-15@14:30", "2024-03-15@16:30", true);
		expect(result).toBe(true);
	});

	it("should handle different days", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@00:00", "2024-03-14@23:59", "2024-03-15@00:01");
		expect(result).toBe(true);
	});

	it("should handle same start and end date", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@15:30", "2024-03-15@15:30", "2024-03-15@15:30");
		expect(result).toBe(false);
	});

	it("should handle same start and end date with acceptSameDate", () => {
		const result = DateHelperSrv.dateIsBetween("2024-03-15@15:30", "2024-03-15@15:30", "2024-03-15@15:30", true);
		expect(result).toBe(true);
	});
});
