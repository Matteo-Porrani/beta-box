import { expect, it, describe } from "vitest";
import { UCollection } from "@/modules/core/classes/UCollection";

const COLORS = [
	{ id: 100, name: "red", code: "R" },
	{ id: 200, name: "green", code: "G" },
	{ id: 300, name: "blue", code: "B" },
	{ id: 400, name: "yellow", code: "Y" },
	{ id: 500, name: "white", code: "W" },
]

const USERS = [
	{ id: 1, name: "Greg", color: "red", age: 31, city: "Paris" },
	{ id: 2, name: "Lucy", color: "blue", age: 28, city: "Paris" },
	{ id: 5, name: "Mike", color: "green", age: 45, city: "Paris" },
	{ id: 7, name: "Luke", color: "green", age: 54, city: "London" },
	{ id: 10, name: "Diane", color: "yellow", age: 24, city: "London" },
]

const OTHER = { id: 99, name: "Kyle", color: "purple", age: 44, city: "Berlin" };

const PRODUCTS = [
	{ id: "IP", name: "iPad Pro 5th Generation", price: 900 },
	{ id: "PR", name: "Epson QuickJet Printer", price: 230 },
	{ id: "MS", name: "Logitech SuperMouse", price: 67 },
]

describe("1 - basic properties", () => {
	
	let u;
	beforeEach(() => {
		u = new UCollection(USERS);
	})
	
	it("returns correct count", () => {
		expect(u.count).toBe(5);
	});
	
	it("returns correct empty count", () => {
		expect(new UCollection([]).count).toBe(0);
	});
	
	it("checks properly if ID is in collection", () => {
		expect(u.has(7)).toBeTruthy();
	});
	
	it("detects that unknown ID is not in collection", () => {
		expect(u.has(12345)).toBeFalsy();
	});
})

describe("2 - adding", () => {
	it("adds item properly", () => {
		const u = new UCollection(USERS);
		u.add(OTHER);
		expect(u.count).toBe(6);
		expect(u.has(OTHER.id)).toBeTruthy();
	});
	
	it("throws when adding item with duplicate id", () => {
		const u = new UCollection([{ id: 1, name: "Alice" }]);
		expect(() => u.add({ id: 1, name: "Alice 2" })).toThrow(/already exists/);
	});
	
	it("skips adding duplicate object when 'noDuplicate' is true", () => {
		const item = { id: 1, name: "Alice" };
		const u = new UCollection([item]);
		expect(() => u.add({ ...item }, { noDuplicate: true })).toThrow(Error);
	});
})

describe("3 - updating", () => {
	it("updates multiple items properly", () => {
		const u = new UCollection(USERS);
		u.update({ color: "white" }, [{ key: "city", matchFn: v => v === "Paris" }])
		expect(u.items).toMatchInlineSnapshot(`
			[
			  {
			    "age": 31,
			    "city": "Paris",
			    "color": "white",
			    "id": 1,
			    "name": "Greg",
			  },
			  {
			    "age": 28,
			    "city": "Paris",
			    "color": "white",
			    "id": 2,
			    "name": "Lucy",
			  },
			  {
			    "age": 45,
			    "city": "Paris",
			    "color": "white",
			    "id": 5,
			    "name": "Mike",
			  },
			  {
			    "age": 54,
			    "city": "London",
			    "color": "green",
			    "id": 7,
			    "name": "Luke",
			  },
			  {
			    "age": 24,
			    "city": "London",
			    "color": "yellow",
			    "id": 10,
			    "name": "Diane",
			  },
			]
		`)
	})
	
	it("updates single item by ID properly", () => {
		const u = new UCollection(PRODUCTS);
		const updatedItemsCount = u.updateById({ price: 750, discount: true }, "IP");
		expect(updatedItemsCount).toBe(1);
		expect(u.items).toMatchInlineSnapshot(`
			[
			  {
			    "discount": true,
			    "id": "IP",
			    "name": "iPad Pro 5th Generation",
			    "price": 750,
			  },
			  {
			    "id": "PR",
			    "name": "Epson QuickJet Printer",
			    "price": 230,
			  },
			  {
			    "id": "MS",
			    "name": "Logitech SuperMouse",
			    "price": 67,
			  },
			]
		`);
	})
	
	it("updates multiple items by passing array of IDs properly", () => {
		const u = new UCollection(PRODUCTS);
		const updatedItemsCount = u.updateById({ price: 100, discount: true }, ["IP", "PR"]);
		expect(updatedItemsCount).toBe(2);
		expect(u.items).toMatchInlineSnapshot(`
			[
			  {
			    "discount": true,
			    "id": "IP",
			    "name": "iPad Pro 5th Generation",
			    "price": 100,
			  },
			  {
			    "discount": true,
			    "id": "PR",
			    "name": "Epson QuickJet Printer",
			    "price": 100,
			  },
			  {
			    "id": "MS",
			    "name": "Logitech SuperMouse",
			    "price": 67,
			  },
			]
		`);
	})
	
	it("DOES NOT update when ID is not found", () => {
		const u = new UCollection(PRODUCTS);
		const updatedItemsCount = u.updateById({ price: 750, discount: true }, "XX")
		expect(updatedItemsCount).toBe(0);
		expect(u.items).toMatchInlineSnapshot(`
			[
			  {
			    "id": "IP",
			    "name": "iPad Pro 5th Generation",
			    "price": 900,
			  },
			  {
			    "id": "PR",
			    "name": "Epson QuickJet Printer",
			    "price": 230,
			  },
			  {
			    "id": "MS",
			    "name": "Logitech SuperMouse",
			    "price": 67,
			  },
			]
		`);
	})
	
	it("returns 0 when update matches no item", () => {
		const u = new UCollection([{ id: 1, age: 30 }]);
		const updated = u.update({ age: 99 }, [{ key: "age", matchFn: v => v > 100 }]);
		expect(updated).toBe(0);
	});
	
	it("update does not overwrite id", () => {
		const u = new UCollection([{ id: 1, name: "A" }]);
		u.update({ id: 2, name: "B" }, [{ key: "id", matchFn: v => v === 1 }]);
		expect(u.findById(1).name).toBe("B");
		expect(u.findById(2)).toBeUndefined();
	});
})

describe("4 - deleting", () => {
	it("deletes item properly", () => {
		const u = new UCollection(USERS);
		u.deleteById(5);
		expect(u.count).toBe(4);
	})
	
	it("deleteById returns false for unknown id", () => {
		const u = new UCollection([{ id: 1 }]);
		expect(u.deleteById(999)).toBe(false);
	});
	
})

describe("5 - finding", () => {
	it("retrieves item by ID properly", () => {
		const u = new UCollection(COLORS);
		const red = u.findById(100);
		expect(JSON.stringify(red)).toMatch(`{"id":100,"name":"red","code":"R"}`)
	});
	
	it("returns undefined for an unknown ID", () => {
		const u = new UCollection(COLORS);
		const unknown = u.findById(999);
		expect(unknown).toBeUndefined();
	});
	
	it("retrieves items matching filters A", () => {
		const u = new UCollection(USERS);
		const above30 = u.findBy([{ key: "age", matchFn: v => v > 30 }])
		expect(above30).toMatchInlineSnapshot(`
			[
			  {
			    "age": 31,
			    "city": "Paris",
			    "color": "red",
			    "id": 1,
			    "name": "Greg",
			  },
			  {
			    "age": 45,
			    "city": "Paris",
			    "color": "green",
			    "id": 5,
			    "name": "Mike",
			  },
			  {
			    "age": 54,
			    "city": "London",
			    "color": "green",
			    "id": 7,
			    "name": "Luke",
			  },
			]
		`)
	});
	
	it("retrieves items matching filters B", () => {
		const u = new UCollection(USERS);
		const above30 = u.findBy([{ key: "id", matchFn: Boolean }])
		expect(above30.map(el => el.name)).toEqual(["Greg","Lucy","Mike","Luke","Diane"])
	});
	
	it("findBy with empty filters returns all items", () => {
		const u = new UCollection([{ id: 1 }, { id: 2 }]);
		expect(u.findBy([]).length).toBe(2);
	});
	
})

describe("6 - edge cases", () => {
	it("handles empty array properly", () => {
		const u = new UCollection([]);
		expect(u.count).toBe(0);
		expect(u.items).toEqual([]);
	});

	it("throws when items lack id", () => {
		expect(() => new UCollection([{ name: "NoID" }])).toThrow(TypeError);
	});
	
	it("treats string and number ids as equal", () => {
		const u = new UCollection([{ id: "123", name: "Alice" }]);
		expect(u.has(123)).toBe(true);
		expect(u.findById(123).name).toBe("Alice");
	});
	
	it("detects duplicate with nested structure", () => {
		const nested = { id: 1, data: { a: 1 } };
		const u = new UCollection([nested]);
		const result = u.add({ id: 2, data: { a: 1 } }, { noDuplicate: true });
		expect(result).toBe(true); // different ID, so should be allowed
	});
	
	it("prevents adding deeply equal object", () => {
		const item = { id: 1, data: { nested: true } };
		const u = new UCollection([item]);
		expect(() => u.add({ ...item }, { noDuplicate: true })).toThrow(/already exists/);
	});
});

describe("7 - sorting", () => {
	it("sorts items numerically by ID by default", () => {
		const u = new UCollection(USERS);
		u.sort();
		expect(u.items.map(item => item.id)).toEqual([1, 2, 5, 7, 10]);
	});
	
	it("sorts items by string key in ascending order by default", () => {
		const u = new UCollection(USERS);
		u.sort({ key: "name" });
		expect(u.items.map(item => item.name)).toEqual(["Diane", "Greg", "Lucy", "Luke", "Mike"]);
	});
	
	it("sorts items by string key in ascending order explicitly", () => {
		const u = new UCollection(USERS);
		u.sort({ key: "name", asc: true });
		expect(u.items.map(item => item.name)).toEqual(["Diane", "Greg", "Lucy", "Luke", "Mike"]);
	});
	
	it("sorts items by string key in descending order", () => {
		const u = new UCollection(USERS);
		u.sort({ key: "name", asc: false });
		expect(u.items.map(item => item.name)).toEqual(["Mike", "Luke", "Lucy", "Greg", "Diane"]);
	});
	
	it("sorts items by color key", () => {
		const u = new UCollection(USERS);
		u.sort({ key: "color" });
		expect(u.items.map(item => item.color)).toEqual(["blue", "green", "green", "red", "yellow"]);
	});
	
	it("sorts items by city key in descending order", () => {
		const u = new UCollection(USERS);
		u.sort({ key: "city", asc: false });
		expect(u.items.map(item => item.city)).toEqual(["Paris", "Paris", "Paris", "London", "London"]);
	});
	
	it("sorts products by name", () => {
		const u = new UCollection(PRODUCTS);
		u.sort({ key: "name" });
		expect(u.items.map(item => item.name)).toEqual([
			"Epson QuickJet Printer",
			"iPad Pro 5th Generation", 
			"Logitech SuperMouse"
		]);
	});
	
	it("sorts single item collection", () => {
		const u = new UCollection([{ id: 1, name: "Alice" }]);
		u.sort({ key: "name" });
		expect(u.items[0].name).toBe("Alice");
	});
	
	it("sorts with case sensitivity", () => {
		const mixedCase = [
			{ id: 1, name: "alice" },
			{ id: 2, name: "Bob" },
			{ id: 3, name: "charlie" },
			{ id: 4, name: "David" }
		];
		const u = new UCollection(mixedCase);
		u.sort({ key: "name" });
		expect(u.items.map(item => item.name)).toEqual(["alice", "Bob", "charlie", "David"]);
	});
	
	it("sorts numerical values in ascending order", () => {
		const u = new UCollection(USERS);
		u.sort({ key: "age" });
		expect(u.items.map(item => item.age)).toEqual([24, 28, 31, 45, 54]);
	});
	
	it("sorts numerical values in descending order", () => {
		const u = new UCollection(USERS);
		u.sort({ key: "age", asc: false });
		expect(u.items.map(item => item.age)).toEqual([54, 45, 31, 28, 24]);
	});
	
	it("sorts product prices numerically", () => {
		const u = new UCollection(PRODUCTS);
		u.sort({ key: "price" });
		expect(u.items.map(item => item.price)).toEqual([67, 230, 900]);
	});
	
	it("sorts mixed data types as strings", () => {
		const mixedData = [
			{ id: 1, value: "text" },
			{ id: 2, value: 42 },
			{ id: 3, value: "123" },
			{ id: 4, value: 7 }
		];
		const u = new UCollection(mixedData);
		u.sort({ key: "value" });
		expect(u.items.map(item => item.value)).toEqual(["123", 7, 42, "text"]);
	});
	
	it("handles null and undefined values", () => {
		const withNulls = [
			{ id: 1, value: null },
			{ id: 2, value: 42 },
			{ id: 3, value: undefined },
			{ id: 4, value: 7 }
		];
		const u = new UCollection(withNulls);
		u.sort({ key: "value" });
		expect(u.items.map(item => item.value)).toEqual([7, 42, null, undefined]);
	});
});

describe("8 - indexing", () => {
	it("returns first item using first property", () => {
		const u = new UCollection(USERS);
		expect(u.first).toEqual(USERS[0]);
	});
	
	it("returns last item using last property", () => {
		const u = new UCollection(USERS);
		expect(u.last).toEqual(USERS[USERS.length - 1]);
	});
	
	it("returns undefined for first/last on empty collection", () => {
		const u = new UCollection([]);
		expect(u.first).toBeUndefined();
		expect(u.last).toBeUndefined();
	});
	
	it("returns item at positive index using at()", () => {
		const u = new UCollection(USERS);
		expect(u.at(0)).toEqual(USERS[0]);
		expect(u.at(1)).toEqual(USERS[1]);
		expect(u.at(2)).toEqual(USERS[2]);
	});
	
	it("returns item at negative index using at()", () => {
		const u = new UCollection(USERS);
		expect(u.at(-1)).toEqual(USERS[USERS.length - 1]);
		expect(u.at(-2)).toEqual(USERS[USERS.length - 2]);
		expect(u.at(-3)).toEqual(USERS[USERS.length - 3]);
	});
	
	it("returns undefined for out-of-bounds positive index", () => {
		const u = new UCollection(USERS);
		expect(u.at(10)).toBeUndefined();
		expect(u.at(USERS.length)).toBeUndefined();
	});
	
	it("returns undefined for out-of-bounds negative index", () => {
		const u = new UCollection(USERS);
		expect(u.at(-10)).toBeUndefined();
		expect(u.at(-(USERS.length + 1))).toBeUndefined();
	});
	
	it("returns undefined for at() on empty collection", () => {
		const u = new UCollection([]);
		expect(u.at(0)).toBeUndefined();
		expect(u.at(-1)).toBeUndefined();
		expect(u.at(1)).toBeUndefined();
	});
	
	it("first and last are equal for single item collection", () => {
		const singleItem = [{ id: 1, name: "Alice" }];
		const u = new UCollection(singleItem);
		expect(u.first).toEqual(u.last);
		expect(u.first).toEqual(singleItem[0]);
	});
	
	it("at() returns defensive copy", () => {
		const u = new UCollection([{ id: 1, name: "Alice" }]);
		const item = u.at(0);
		item.name = "Modified";
		expect(u.at(0).name).toBe("Alice"); // Original unchanged
	});
	
	it("first and last return defensive copies", () => {
		const u = new UCollection([{ id: 1, name: "Alice" }]);
		const first = u.first;
		const last = u.last;
		first.name = "Modified";
		last.name = "Modified";
		expect(u.first.name).toBe("Alice"); // Original unchanged
		expect(u.last.name).toBe("Alice"); // Original unchanged
	});
	
	it("at() performs deep cloning of nested objects", () => {
		const nestedData = {
			id: 1,
			name: "Alice",
			profile: {
				age: 30,
				address: {
					city: "Paris",
					country: "France"
				}
			},
			tags: ["developer", "vue"]
		};
		const u = new UCollection([nestedData]);
		const clonedItem = u.at(0);
		
		// Modify nested properties
		clonedItem.profile.age = 31;
		clonedItem.profile.address.city = "London";
		clonedItem.tags.push("javascript");
		
		// Original should remain unchanged
		expect(u.at(0).profile.age).toBe(30);
		expect(u.at(0).profile.address.city).toBe("Paris");
		expect(u.at(0).tags).toEqual(["developer", "vue"]);
		
		// Cloned item should have modified values
		expect(clonedItem.profile.age).toBe(31);
		expect(clonedItem.profile.address.city).toBe("London");
		expect(clonedItem.tags).toEqual(["developer", "vue", "javascript"]);
	});
	
	it("at() demonstrates shallow vs deep cloning behavior", () => {
		const originalData = {
			id: 1,
			name: "Alice",
			settings: {
				theme: "dark",
				notifications: true
			},
			preferences: ["vue", "typescript"]
		};
		const u = new UCollection([originalData]);
		const clonedItem = u.at(0);
		
		// This will fail with shallow cloning because arrays are references
		clonedItem.preferences.push("javascript");
		clonedItem.settings.theme = "light";
		
		// With shallow cloning, this would be ["vue", "typescript", "javascript"]
		// With deep cloning, this should remain ["vue", "typescript"]
		expect(u.at(0).preferences).toEqual(["vue", "typescript"]);
		// Settings should also remain unchanged
		expect(u.at(0).settings.theme).toBe("dark");
		
		// Verify the cloned item has the modified array and settings
		expect(clonedItem.preferences).toEqual(["vue", "typescript", "javascript"]);
		expect(clonedItem.settings.theme).toBe("light");
	});
});

describe("9 - replacing", () => {
	
	it('replaces items properly if new items are valid', () => {
		const u = new UCollection(USERS);
		expect(u.count).toBe(5);
		u.replace(PRODUCTS);
		expect(u.count).toBe(3);
	});
	
	it('throws when replacing if new items are invalid', () => {
		const u = new UCollection(USERS);
		expect(u.count).toBe(5);
		expect(() => u.replace([{ name: "noID" }])).toThrowError();
	});
	
	it('replaces all items with an empty array', () => {
		const u = new UCollection(USERS);
		u.replace([]);
		expect(u.count).toBe(0);
		expect(u.items).toEqual([]);
	});

	it('throws an error when replacing with a non-array value', () => {
		const u = new UCollection(USERS);
		expect(() => u.replace(null)).toThrowError();
		expect(() => u.replace(undefined)).toThrowError();
		expect(() => u.replace("a string")).toThrowError();
	});

	it('defensively copies the new items', () => {
		const u = new UCollection(USERS);
		const newItems = [{ id: 100, name: 'new item' }];
		u.replace(newItems);
		expect(u.count).toBe(1);

		// Modify the original array
		newItems.push({ id: 101, name: 'another new item' });

		// The collection should not be affected
		expect(u.count).toBe(1);
	});
});


