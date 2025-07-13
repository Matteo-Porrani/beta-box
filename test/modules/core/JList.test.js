import { it, describe, expect } from "vitest";

import { JList } from "@/modules/core/classes/JList";


const PEOPLE = [
	{ id: 1, name: "Alice", age: 28, city: "Amsterdam" },
	{ id: 2, name: "Bob", age: 33, city: "Berlin" },
	{ id: 3, name: "Charlie", age: 44, city: "Chicago" },
	{ id: 4, name: "Diana", age: 54, city: "Dublin" },
];

const PRODUCTS = [
	{ id: "IP", name: "iPad Pro 5", price: 900 },
	{ id: "PR", name: "Epson QuickJet", price: 230 },
]

describe("01 - READING BASIC PROPERTIES", () => {
	
	const list = new JList(PEOPLE);
	
	it("returns correct size", () => {
		expect(list.size).toEqual(4);
	});
	
	it("returns first item", () => {
		expect(list.first).toEqual(
			{ id: 1, name: "Alice", age: 28, city: "Amsterdam" }
		);
	});
	
	it("returns last item", () => {
		expect(list.last).toEqual(
			{ id: 4, name: "Diana", age: 54, city: "Dublin" }
		);
	});
	
	it("returns item at index", () => {
		expect(list.at(1)).toEqual(
			{ id: 2, name: "Bob", age: 33, city: "Berlin" }
		);
	});
	
	it("checks if id exists", () => {
		expect(list.has(3)).toBe(true);
		expect(list.has(50)).toBe(false);
	});
	
	it("returns the items", () => {
		expect(list.items).toEqual(PEOPLE);
	})
	
	it("properly clones items on initialization", () => {
		PEOPLE[0].name = "Alexandra";
		expect(list.items).not.toEqual(PEOPLE);
		expect(list.first.name).toBe("Alice");
	})
	
});



describe("02 - ADDING ITEMS", () => {
	
	it("adds item at the end", () => {
		const list = new JList(PRODUCTS);
		list.add({ id: "MM", name: "Mighty Mouse", price: 95 });
		
		expect(list.size).toBe(3);
		expect(list.items).toEqual([
			{ id: "IP", name: "iPad Pro 5", price: 900 },
			{ id: "PR", name: "Epson QuickJet", price: 230 },
			{ id: "MM", name: "Mighty Mouse", price: 95 },
		]);
	});
	
	
	it("adds item at the beginning", () => {
		const list = new JList(PRODUCTS);
		list.add(
			{ id: "MM", name: "Mighty Mouse", price: 95 },
			{ prepend: true }
		);
		
		expect(list.size).toBe(3);
		expect(list.items).toEqual([
			{ id: "MM", name: "Mighty Mouse", price: 95 },
			{ id: "IP", name: "iPad Pro 5", price: 900 },
			{ id: "PR", name: "Epson QuickJet", price: 230 }
		]);
	});
	
	it("throws error when adding item with existing id", () => {
		const list = new JList(PRODUCTS);
		
		expect(() => {
			list.add({ id: "IP", name: "Infinite Printer", price: 202 });
		}).toThrow("Item with id 'IP' already exists.");
		
		expect(list.size).toBe(2);
	});
	
});
