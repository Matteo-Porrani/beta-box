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
];

const GROCERIES = [
	{ id: 1, name: "Milk", expiration: "2023-01-01" },
	{ id: 2, name: "Bread", expiration: "2023-01-02" },
	{ id: 3, name: "Eggs", expiration: "2023-01-03" },
	{ id: 4, name: "Cheese", expiration: "2023-01-02" },
	{ id: 5, name: "Tomatoes", expiration: "2023-01-05" },
	{ id: 6, name: "Onions", expiration: "2023-01-06" },
	{ id: 7, name: "Apples", expiration: "2023-01-02" },
	{ id: 8, name: "Bananas", expiration: "2023-01-03" },
	{ id: 9, name: "Oranges", expiration: "2023-01-09" },
	{ id: 10, name: "Pears", expiration: "2023-01-03" },
];


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
		
		const CLONES = [...PEOPLE];
		
		const list = new JList(CLONES);
		CLONES[0].name = "Alexandra";

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


describe("03 - DELETING ITEMS", () => {
	
	it("deletes item by ID", () => {
		
		const list = new JList(PEOPLE);
		
		const deleted = list.deleteById(2);
		
		expect(deleted).toBe(1);
		expect(list.size).toBe(3);
		expect(list.items).toEqual(
			[
				{
					"age": 28,
					"city": "Amsterdam",
					"id": 1,
					"name": "Alice",
				},
				{
					"age": 44,
					"city": "Chicago",
					"id": 3,
					"name": "Charlie",
				},
				{
					"age": 54,
					"city": "Dublin",
					"id": 4,
					"name": "Diana",
				},
			]
		)
		
	});
	
	it("deletes single item by criteria", () => {
		
		const list = new JList(PEOPLE);
		
		const deleted = list.delete([
			{ key: "name", matchFn: (value) => value === "Charlie" }
		]);
		
		expect(deleted).toBe(1);
		expect(list.size).toBe(3);
		expect(list.items).toEqual([
			{ id: 1, name: "Alice", age: 28, city: "Amsterdam" },
			{ id: 2, name: "Bob", age: 33, city: "Berlin" },
			{ id: 4, name: "Diana", age: 54, city: "Dublin" },
		]);
	});
	
	it("deletes multiple items by criteria", () => {
		
		const list = new JList(GROCERIES);
		
		const deleted = list.delete([
			{ key: "expiration", matchFn: (value) => value <= "2023-01-02" },
		]);
		
		expect(deleted).toBe(4);
		expect(list.size).toBe(6);
		expect(list.items.map(item => item.id)).toEqual(
			[3, 5, 6, 8, 9, 10]
		);
		
	})
	
});


describe("04 - UPDATING ITEMS", () => {
	
	it("updates single item by with fixed changes", () => {
		const list = new JList(PEOPLE);
		
		const updated = list.update(
			[{ key: "name", matchFn: (value) => value === "Alice" }], // criteria
			{ age: 29 } // changes
		);
		
		expect(updated).toBe(1);
		expect(list.items).toEqual([
			{ id: 1, name: "Alice", age: 29, city: "Amsterdam" },
			{ id: 2, name: "Bob", age: 33, city: "Berlin" },
			{ id: 3, name: "Charlie", age: 44, city: "Chicago" },
			{ id: 4, name: "Diana", age: 54, city: "Dublin" },
		])
		
	});
	
	it("updates single item with update functions", () => {
		const list = new JList(PEOPLE);
		
		const updated = list.updateWithFn(
			[
				{ key: "id", matchFn: (value) => value < 10 }
			], // will update all
			[
				{ key: "age", updateFn: (value) => value + 1 }, // will increment age property by 1
			]
		);
		
		expect(updated).toBe(4);
		expect(list.items).toEqual([
			{ id: 1, name: "Alice", age: 29, city: "Amsterdam" },
			{ id: 2, name: "Bob", age: 34, city: "Berlin" },
			{ id: 3, name: "Charlie", age: 45, city: "Chicago" },
			{ id: 4, name: "Diana", age: 55, city: "Dublin" },
		])
		
	});
	
	
	
	
	
});


