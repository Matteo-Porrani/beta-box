import { describe, it, expect, beforeEach } from "vitest";
import ISS from "@/modules/core/services/samples/IIFEServiceSample";


const PEOPLE = [
	{
		id: 1,
		firstName: "Alice",
		lastName: "Johnson",
		location: { city: "New York", state: "NY" },
		hiredIn: 2018
	},
	{
		id: 2,
		firstName: "Bob",
		lastName: "Smith",
		location: { city: "San Francisco", state: "CA" },
		hiredIn: 2015
	},
	{
		id: 3,
		firstName: "Charlie",
		lastName: "Lee",
		location: { city: "Chicago", state: "IL" },
		hiredIn: 2021
	},
	{
		id: 4,
		firstName: "Diana",
		lastName: "Evans",
		location: { city: "Austin", state: "TX" },
		hiredIn: 2019
	},
	{
		id: 5,
		firstName: "Ethan",
		lastName: "Wright",
		location: { city: "Seattle", state: "WA" },
		hiredIn: 2020
	},
	{
		id: 6,
		firstName: "Fiona",
		lastName: "Adams",
		location: { city: "Boston", state: "MA" },
		hiredIn: 2017
	},
	{
		id: 7,
		firstName: "George",
		lastName: "Clark",
		location: { city: "London", state: "UK" },
		hiredIn: 2016
	},
	{
		id: 8,
		firstName: "Hannah",
		lastName: "Lewis",
		location: { city: "London", state: "UK" },
		hiredIn: 2022
	},
	{
		id: 9,
		firstName: "Isaac",
		lastName: "Walker",
		location: { city: "London", state: "UK" },
		hiredIn: 2014
	},
	{
		id: 10,
		firstName: "Julia",
		lastName: "Bennett",
		location: { city: "London", state: "UK" },
		hiredIn: 2023
	}
];


describe("01", () => {
	it("should increment counter", () => {
		const c = ISS.increment();
		expect(c).toBe(1)
	});
	
	it("should refine data", () => {
		const rd = ISS.refineComplexData(PEOPLE)
		expect(rd[0]).toMatchInlineSnapshot(`
			{
			  "fullName": "JOHNSON Alice",
			  "id": 1,
			  "seniority": 7,
			  "site": "NY-New York",
			}
		`)
	})
	
	it("utility fn works fine", () => {
		const emp = PEOPLE[2]
		expect(ISS._private.parseEmployee(emp)).toMatchInlineSnapshot(`
			{
			  "fullName": "LEE Charlie",
			  "id": 3,
			  "seniority": 4,
			  "site": "IL-Chicago",
			}
		`);
		
	})
})
