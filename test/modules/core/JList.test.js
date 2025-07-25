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

const VEHICLES = [
	{ id: 1, color: "red", brand: "Toyota", model: "Camry", year: 2020 },
	{ id: 2, color: "black", brand: "Honda", model: "Civic", year: 2019 },
	{ id: 3, color: "red", brand: "Ford", model: "Mustang", year: 2021 },
	{ id: 4, color: "red", brand: "Chevrolet", model: "Cruze", year: 2022 },
	{ id: 5, color: "blue", brand: "Nissan", model: "Altima", year: 2018 },
	{ id: 6, color: "red", brand: "Mazda", model: "MX-5", year: 2019 },
	{ id: 7, color: "black", brand: "Subaru", model: "Impreza", year: 2017 },
	{ id: 8, color: "white", brand: "Volkswagen", model: "Jetta", year: 2022 },
]


describe("00 - INITIALIZATION", () => {
	
	it("throws error when objects in the array don't have an 'id' property", () => {
		expect(() => new JList([
			{ name: "Amy", city: "Amsterdam" },
			{ name: "Ben", city: "Berlin" },
			{ name: "Charlie", city: "Chicago" },
		])).toThrow;
	});
	
	it("clones the array passed for initialization", () => {
	
		const ROBOTS = [
			{ id: 1, name: "Beta", power: 4000 },
			{ id: 2, name: "Makro", power: 5500 },
			{ id: 3, name: "Thyps", power: 3400 },
		]
		const list = new JList(ROBOTS);
		
		ROBOTS[0].name = "Alpha";
		
		expect(list.first.name).toBe("Beta");
		expect(ROBOTS[0].name).toBe("Alpha");
	});
	
});


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
				}
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
			{ id: 4, name: "Diana", age: 54, city: "Dublin" }
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
			{ id: 4, name: "Diana", age: 55, city: "Dublin" }
		])
	});
	
	it("prevents ID mutation - updateById", () => {
		const list = new JList([
			{ id: 101, name: "PHP" },
			{ id: 102, name: "Python" },
			{ id: 103, name: "JavaScript" },
		]);
		
		// trying to update ID
		const updated = list.updateById(101, { id: 999, name: "Rust" });
		
		expect(updated).toBe(1); // the 'name' property was updated on the corresponding item
		expect(list.items).toEqual([
			{ id: 101, name: "Rust" }, // the 'id' property was not updated
			{ id: 102, name: "Python" },
			{ id: 103, name: "JavaScript" },
		]);
	});
	
	it("prevents ID mutation - update", () => {
		const list = new JList([
			{ id: 101, name: "PHP" },
			{ id: 102, name: "Python" },
			{ id: 103, name: "JavaScript" },
		]);
		
		const updated = list.update(
			[{ key: "id", matchFn: (id) => id === 101 }],
			{ id: 999, name: "Rust" } // trying to update ID
		);
		
		expect(updated).toBe(1); // the 'name' property was updated on the corresponding item
		expect(list.items).toEqual([
			{ id: 101, name: "Rust" }, // the 'id' property was not updated
			{ id: 102, name: "Python" },
			{ id: 103, name: "JavaScript" },
		]);
	});
	
	it("prevents ID mutation - updateWithFn", () => {
		const list = new JList([
			{ id: 101, name: "PHP" },
			{ id: 102, name: "Python" },
			{ id: 103, name: "JavaScript" },
		]);
		
		const updated = list.updateWithFn(
			[{ key: "id", matchFn: (id) => id === 101 }],
			[
				{ key: "id", updateFn: (id) => id * 10 }, // trying to update ID
				{ key: "name", updateFn: () => "Rust" },
			]
		);
		
		expect(updated).toBe(1); // the 'name' property was updated on the corresponding item
		expect(list.items).toEqual([
			{ id: 101, name: "Rust" }, // the 'id' property was not updated
			{ id: 102, name: "Python" },
			{ id: 103, name: "JavaScript" },
		]);
	});
	
	it("doesn't update if ID is not found", () => {
		const list = new JList([
			{ id: 101, name: "PHP" },
			{ id: 102, name: "Python" },
			{ id: 103, name: "JavaScript" },
		]);
		
		// trying to update ID
		const updated = list.updateById(999, { name: "Rust" });
		expect(updated).toBe(0);
	});
	
});


describe("05 - FINDING ITEMS", () => {
	it("finds single item by criteria", () => {
		
		const list = new JList(PEOPLE);
		
		const found = list.find([
			{ key: "name", matchFn: (value) => value === "Alice" }
		]);
		
		expect(found).toEqual([{ id: 1, name: "Alice", age: 28, city: "Amsterdam" }]);
	});
	
	it("finds multiple items by criteria", () => {
		
		const list = new JList(VEHICLES);
		
		const found = list.find([
			{ key: "color", matchFn: (value) => value === "red" },
			{ key: "year", matchFn: (value) => value <= 2020 },
		]);
		
		// console.log(found)
		
		expect(found.length).toBe(2);
		expect(found).toEqual([
			{ id: 1, color: "red", brand: "Toyota", model: "Camry", year: 2020 },
			{ id: 6, color: "red", brand: "Mazda", model: "MX-5", year: 2019 }
		]);
		

	});
	
	it("finds single item by id", () => {
		const list = new JList(PEOPLE);
		const found = list.findById(4);
		expect(found).toEqual({ id: 4, name: "Diana", age: 54, city: "Dublin" });
	})
})

describe("06 - SORTING ITEMS", () => {
	
	it("sorts items by NUMERIC key", () => {
		const list = new JList([
			{ id: 7, name: "Peter", age: 44, city: "Chicago" },
			{ id: 1, name: "Jack", age: 25, city: "London" },
			{ id: 25, name: "Mary", age: 38, city: "Paris" },
			{ id: 33, name: "Albert", age: 55, city: "Madrid" },
		]);
		
		list.sort({ key: "age", order: 1 });
		
		expect(list.items).toEqual([
			{ id: 1, name: "Jack", age: 25, city: "London" },
			{ id: 25, name: "Mary", age: 38, city: "Paris" },
			{ id: 7, name: "Peter", age: 44, city: "Chicago" },
			{ id: 33, name: "Albert", age: 55, city: "Madrid" },
		]);
		
	});
	
	it("sorts items by ALPHABETICAL key", () => {
		const list = new JList([
			{ id: 7, name: "Peter", age: 44, city: "Chicago" },
			{ id: 1, name: "Jack", age: 25, city: "London" },
			{ id: 25, name: "Mary", age: 38, city: "Paris" },
			{ id: 33, name: "Albert", age: 55, city: "Madrid" },
		]);
		
		list.sort({ key: "name", order: -1 });
		
		expect(list.items).toEqual([
			{ id: 7, name: "Peter", age: 44, city: "Chicago" },
			{ id: 25, name: "Mary", age: 38, city: "Paris" },
			{ id: 1, name: "Jack", age: 25, city: "London" },
			{ id: 33, name: "Albert", age: 55, city: "Madrid" },
		]);
	});
	
	it("sorts items by NESTED key", () => {
		const list = new JList([
			{ id: 77, name: "Peter", location: { city: "Washington" } },
			{ id: 5, name: "Will", location: { city: "Detroit" } },
			{ id: 31, name: "Karen", location: { city: "Atlanta" } },
		]);
		
		list.sort({ key: "location.city", order: 1 });
		
		expect(list.items).toEqual([
			{ id: 31, name: "Karen", location: { city: "Atlanta" } },
			{ id: 5, name: "Will", location: { city: "Detroit" } },
			{ id: 77, name: "Peter", location: { city: "Washington" } },
		]);
	});
	
})




