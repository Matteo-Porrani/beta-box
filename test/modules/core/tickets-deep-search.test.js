import { it, describe, expect } from "vitest";
import { flattenObject, flatObjectMatchesSearch, filterArrayWithDeepMatch } from "@/modules/core/utils/table-utils";



const PEOPLE = [
	{
		id: 123,
		name: "Bob",
		location: {
			city: "London",
			from: 2007,
			comments: [
				{ code: 1, text: "I like tennis" },
				{ code: 2, text: "I have a dog" },
			]
		},
	},
	{
		id: 457,
		name: "Anne",
		location: {
			city: "Paris",
			from: 2001,
			comments: [
				{ code: 1, text: "I am a fashion victim" },
				{ code: 2, text: "cats are cute" },
			]
		},
	},
	{
		id: 999,
		name: "Jack",
		location: {
			city: "Melbourne",
			from: 1999,
			friends: ["cats", "cows"],
			comments: [
				{ code: 1, text: "Good vibes" },
			]
		},
	},
]


describe("01 - flattenObject", () => {
	it("object is properly flattened", () => {
		
		const ob1 = {
			name: "Bob",
			location: {
				city: "Paris",
				from: 2001,
				comments: {
					hobbies: "Tennis, Music",
					songs: [
						{ gender: "rock", title: "Highway to Hell" },
						{ gender: "pop", title: "Yellow" },
					]
				}
			}
		}

		// const obj = PEOPLE[0];
		
		// console.log(flattenObject(ob1))
		expect(flattenObject(ob1)).toEqual({
			name: 'Bob',
			city: 'Paris',
			from: 2001,
			hobbies: 'Tennis, Music',
			songs: '[{"gender":"rock","title":"Highway to Hell"},{"gender":"pop","title":"Yellow"}]'
		})
	
	});
	
	it("object is properly flattened - with exclusion", () => {
		
		const ob1 = {
			name: "Bob",
			location: {
				city: "Paris",
				from: 2001,
				comments: {
					hobbies: "Tennis, Music",
					songs: [
						{ gender: "rock", title: "Highway to Hell" },
						{ gender: "pop", title: "Yellow" },
					]
				}
			}
		}
		
		expect(flattenObject(ob1, ["from", "songs"])).toEqual({
			name: 'Bob',
			city: 'Paris',
			hobbies: 'Tennis, Music',
		})
		
	});
});

describe("02 - flatObjectMatchesSearch", () => {
	
	const bob = {
		name: "Bob",
		location: {
			city: "Paris",
			from: 2001,
			animals: "dog",
			comments: {
				hobbies: "Tennis, Music",
				songs: [
					{ gender: "rock", title: "Highway to Hell" },
					{ gender: "pop", title: "Yellow" },
				]
			}
		}
	}
	
	it("object matches search", () => {
		expect(flatObjectMatchesSearch(bob, "dog")).toBeTruthy();
	});
	
	it("object matches search - with exclusion", () => {
		expect(flatObjectMatchesSearch(bob, "dog", ["animals"])).toBeFalsy();
	});
})

describe("03 - deep search in array", () => {
	
	it("array is properly filtered - on dog", () => {
		expect(filterArrayWithDeepMatch(PEOPLE, "dog").length).toBe(1)
	});
	
	it("array is properly filtered - on cats", () => {
		expect(filterArrayWithDeepMatch(PEOPLE, "cats").length).toBe(2)
	});
	
	it("array is properly filtered - on cats - with exclusion", () => {
		expect(filterArrayWithDeepMatch(PEOPLE, "cats", ["friends"]).length).toBe(1)
	});
	
	it("array is properly filtered - no mutation on original array", () => {
		expect(filterArrayWithDeepMatch(PEOPLE, "cats")).toMatchInlineSnapshot(`
			[
			  {
			    "id": 457,
			    "location": {
			      "city": "Paris",
			      "comments": [
			        {
			          "code": 1,
			          "text": "I am a fashion victim",
			        },
			        {
			          "code": 2,
			          "text": "cats are cute",
			        },
			      ],
			      "from": 2001,
			    },
			    "name": "Anne",
			  },
			  {
			    "id": 999,
			    "location": {
			      "city": "Melbourne",
			      "comments": [
			        {
			          "code": 1,
			          "text": "Good vibes",
			        },
			      ],
			      "friends": [
			        "cats",
			        "cows",
			      ],
			      "from": 1999,
			    },
			    "name": "Jack",
			  },
			]
		`)
	});
	

})


