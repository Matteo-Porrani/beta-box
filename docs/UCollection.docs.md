# UCollection

The UCollection class provides a robust way to manage collections of objects that have unique IDs.

It offers methods for adding, finding, updating, deleting and sorting items while maintaining data integrity and preventing ID conflicts.

## Constructor

Creates a new collection from an array of objects. Each object must have an `id` property.

```javascript
const collection = new UCollection([
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 }
]);
```

**Throws:** `TypeError` if items is not an array or contains invalid objects without `id` properties.

## Properties

### `count`
Returns the number of items in the collection.

```javascript
const collection = new UCollection([{ id: 1 }, { id: 2 }]);
console.log(collection.count); // 2
```

### `items`
Returns a defensive copy of all items in the collection.

```javascript
const collection = new UCollection([{ id: 1, name: "Alice" }]);
const items = collection.items; // Safe copy, won't affect original
```

### `first`
Returns the first item in the collection.

```javascript
const collection = new UCollection([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
]);
const firstItem = collection.first; // { id: 1, name: "Alice" }
```

**Returns:** `object|undefined` - The first item or undefined if collection is empty

### `last`
Returns the last item in the collection.

```javascript
const collection = new UCollection([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
]);
const lastItem = collection.last; // { id: 2, name: "Bob" }
```

**Returns:** `object|undefined` - The last item or undefined if collection is empty

## Methods

### `at(index)`
Returns the item at the specified index. Supports negative indices for counting from the end.

```javascript
const collection = new UCollection([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
]);

collection.at(0);  // { id: 1, name: "Alice" } (first item)
collection.at(1);  // { id: 2, name: "Bob" } (second item)
collection.at(-1); // { id: 3, name: "Charlie" } (last item)
collection.at(-2); // { id: 2, name: "Bob" } (second to last)
collection.at(10); // undefined (out of bounds)
```

**Parameters:**
- `index` (number): The index of the item to retrieve (can be negative)

**Returns:** `object|undefined` - The item at the specified index or undefined if out of bounds

### `has(id)`
Checks if an item with the specified ID exists in the collection.

```javascript
const collection = new UCollection([{ id: 1, name: "Alice" }]);
collection.has(1); // true
collection.has(999); // false
collection.has("1"); // true (string/number ID equality)
```

**Parameters:**
- `id` (number|string): The ID to search for

**Returns:** `boolean`

### `findById(id)`
Retrieves an item by its ID.

```javascript
const collection = new UCollection([{ id: 1, name: "Alice", age: 30 }]);
const item = collection.findById(1);
// { id: 1, name: "Alice", age: 30 }

const notFound = collection.findById(999);
// undefined
```

**Parameters:**
- `id` (number|string): The ID to search for

**Returns:** `object|undefined` - The found item or undefined

### `findBy(filters)`
Retrieves items that match the specified filters.

```javascript
const users = [
  { id: 1, name: "Alice", age: 30, city: "Paris" },
  { id: 2, name: "Bob", age: 25, city: "London" },
  { id: 3, name: "Charlie", age: 35, city: "Paris" }
];
const collection = new UCollection(users);

// Find users over 30
const olderUsers = collection.findBy([
  { key: "age", matchFn: (value) => value > 30 }
]);

// Find users in Paris
const parisUsers = collection.findBy([
  { key: "city", matchFn: (value) => value === "Paris" }
]);

// Find users over 30 in Paris
const olderParisUsers = collection.findBy([
  { key: "age", matchFn: (value) => value > 30 },
  { key: "city", matchFn: (value) => value === "Paris" }
]);
```

**Parameters:**
- `filters` (Array): Array of filter objects with `key` and `matchFn` properties

**Returns:** `object[]` - Array of matching items

### `replace(items)`
Replaces the entire collection with a new set of items.

```javascript
const collection = new UCollection([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
]);

collection.replace([
  { id: 10, name: "Charlie" },
  { id: 20, name: "David" }
]);

console.log(collection.count); // 2
console.log(collection.items[0].name); // "Charlie"
```

**Parameters:**
- `items` (`Array<object>`): An array of objects to replace the current items. Each object must have an `id` property.

**Throws:**
- `TypeError`: If `items` is not an array or if any item is invalid (not an object or missing an `id`).

### `add(item, options)`
Adds a new item to the collection.

```javascript
const collection = new UCollection([]);

// Basic add
collection.add({ id: 1, name: "Alice" });

// Add at beginning
collection.add({ id: 2, name: "Bob" }, { prepend: true });

// Add with duplicate prevention
collection.add({ id: 3, name: "Charlie" }, { noDuplicate: true });
```

**Parameters:**
- `item` (object): The object to add (must have an `id` property)
- `options` (object, optional):
    - `prepend` (boolean, default: false): If true, adds at the beginning
    - `noDuplicate` (boolean, default: false): If true, avoids adding if an identical object exists

**Returns:** `boolean` - True if item was added, false if it was skipped

**Throws:**
- `TypeError` if item is not a valid object with an `id` property
- `Error` if an item with the same ID already exists

### `update(changes, filters)`
Updates all items matching the given filters.

```javascript
const users = [
  { id: 1, name: "Alice", age: 30, city: "Paris" },
  { id: 2, name: "Bob", age: 25, city: "London" },
  { id: 3, name: "Charlie", age: 35, city: "Paris" }
];
const collection = new UCollection(users);

// Update all users in Paris
const updatedCount = collection.update(
  { city: "Berlin" },
  [{ key: "city", matchFn: (value) => value === "Paris" }]
);
// updatedCount = 2
```

**Parameters:**
- `changes` (object): Key/value pairs to merge into matching items
- `filters` (Array): Array of filter objects to identify target items

**Returns:** `number` - The number of items updated

### `updateById(changes, id)`
Updates a single item by its ID, or multiple items if an array of IDs is provided.

```javascript
const collection = new UCollection([
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
  { id: 3, name: "Charlie", age: 35 }
]);

// Update single item
const updatedCount = collection.updateById({ age: 31 }, 1);
// updatedCount = 1
// Item is now: { id: 1, name: "Alice", age: 31 }

// Update multiple items by array of IDs
const updatedCount2 = collection.updateById({ city: "Paris" }, [1, 2]);
// updatedCount2 = 2
// Items 1 and 2 now have city: "Paris"
```

**Parameters:**
- `changes` (object): Key/value pairs to merge into the item(s)
- `id` (number|string|number[]|string[]): The ID of the item to update, or an array of IDs for multiple items

**Returns:** `number` - The number of items updated (0 or more)

### `delete(filters)`
Deletes all items matching the given filters.

```javascript
const users = [
  { id: 1, name: "Alice", age: 30, city: "Paris" },
  { id: 2, name: "Bob", age: 25, city: "London" },
  { id: 3, name: "Charlie", age: 35, city: "Paris" }
];
const collection = new UCollection(users);

// Delete all users in Paris
const deletedCount = collection.delete([
  { key: "city", matchFn: (value) => value === "Paris" }
]);
// deletedCount = 2
```

**Parameters:**
- `filters` (Array): Array of filter objects to identify items to delete

**Returns:** `number` - The number of items removed

### `deleteById(id)`
Deletes a single item by its ID.

```javascript
const collection = new UCollection([{ id: 1, name: "Alice" }]);

const deleted = collection.deleteById(1);
// deleted = true

const notFound = collection.deleteById(999);
// notFound = false
```

**Parameters:**
- `id` (number|string): The ID of the item to delete

**Returns:** `boolean` - True if item was deleted, false if not found

### `sort(options)`
Sorts the collection by a specified key. Automatically detects data types for optimal sorting.

```javascript
const users = [
  { id: 3, name: "Charlie", age: 35 },
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 }
];
const collection = new UCollection(users);

// Sort by ID (default)
collection.sort();
// Result: sorted by id [1, 2, 3]

// Sort by name in ascending order
collection.sort({ key: "name" });
// Result: ["Alice", "Bob", "Charlie"]

// Sort by age in descending order
collection.sort({ key: "age", asc: false });
// Result: [35, 30, 25]

// Sort by name in descending order
collection.sort({ key: "name", asc: false });
// Result: ["Charlie", "Bob", "Alice"]
```

**Parameters:**
- `options` (object, optional):
    - `key` (string, default: "id"): The property name to sort by
    - `asc` (boolean, default: true): Sort direction (true = ascending, false = descending)

**Features:**
- Automatically detects number types for numerical sorting
- Uses `localeCompare()` for string sorting
- Handles mixed data types by converting to strings
- Gracefully handles null and undefined values
- Maintains collection integrity with defensive copying

## Data Type Handling

The UCollection automatically handles different data types:

- **Numbers**: Sorted numerically (1, 2, 10, 100)
- **Strings**: Sorted alphabetically with proper locale support
- **Mixed types**: Converted to strings for comparison
- **Null/undefined**: Treated as lowest priority values

## Error Handling

The UCollection provides robust error handling:

- **TypeError**: Thrown for invalid input types
- **Error**: Thrown for ID conflicts during add operations
- **Graceful degradation**: Methods return appropriate default values when operations fail

## Best Practices

1. **Always use unique IDs**: Each item must have a unique `id` property
2. **Use filters for complex queries**: The `findBy` method is powerful for complex filtering
3. **Leverage automatic sorting**: The `sort` method handles data types automatically
4. **Check return values**: Methods return useful information about operation success
5. **Use defensive copying**: The `items` property provides safe access to collection data
