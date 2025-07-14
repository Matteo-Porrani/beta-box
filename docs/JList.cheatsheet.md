# JList Cheatsheet

## Constructor
```javascript
new JList(items = [])
```
Creates a new JList instance with an array of objects.

```javascript
const list = new JList([
    { id: 1, name: "John", age: 30 },
    { id: 2, name: "Jane", age: 25 }
]);
```

## Properties

### `.items`
Returns the internal array of items.
```javascript
console.log(list.items); // [{ id: 1, name: "John", age: 30 }, ...]
```

### `.size`
Returns the number of items.
```javascript
console.log(list.size); // 2
```

### `.first`
Returns the first item.
```javascript
console.log(list.first); // { id: 1, name: "John", age: 30 }
```

### `.last`
Returns the last item.
```javascript
console.log(list.last); // { id: 2, name: "Jane", age: 25 }
```

## Methods

### `.at(index)`
Returns item at specific index.
```javascript
list.at(0); // { id: 1, name: "John", age: 30 }
list.at(-1); // { id: 2, name: "Jane", age: 25 }
```

### `.has(id)`
Checks if item with ID exists.
```javascript
list.has(1); // true
list.has(999); // false
```

### `.add(item, options)`
Adds a new item. Options: `{ prepend: false }`
```javascript
list.add({ id: 3, name: "Bob", age: 35 });
list.add({ id: 4, name: "Alice", age: 28 }, { prepend: true });
```

### `.delete(criteria)`
Deletes items matching criteria. Returns count of deleted items.
```javascript
// Delete by age
list.delete([{ key: "age", matchFn: age => age > 30 }]); // 1

// Delete by name
list.delete([{ key: "name", matchFn: name => name.startsWith("J") }]); // 2
```

### `.deleteById(id)`
Deletes item by ID. Returns count of deleted items.
```javascript
list.deleteById(1); // 1
list.deleteById(999); // 0
```

### `.update(criteria, changes)`
Updates items matching criteria. Returns count of updated items. ID mutations are prevented.
```javascript
// Update age for all Johns
list.update([{ key: "name", matchFn: name => name === "John" }], { age: 31 });

// Update multiple fields
list.update([{ key: "age", matchFn: age => age < 30 }], { 
    status: "young", 
    category: "A" 
});

// ID mutation attempts are ignored
list.update([{ key: "name", matchFn: name => name === "John" }], { id: 999 }); // ID stays unchanged
```

### `.updateById(id, changes)`
Updates item by ID. Returns count of updated items (1 or 0). ID mutations are prevented.
```javascript
// Update item by ID
list.updateById(1, { name: "Johnny", age: 32 });

// Update multiple fields
list.updateById(2, { status: "active", lastLogin: new Date() });

// ID mutation attempts are ignored
list.updateById(1, { id: 999 }); // ID stays unchanged
```

### `.updateWithFn(criteria, updateSpecs)`
Updates items using functions. Returns count of updated items. ID mutations are prevented.
```javascript
// Increment age by 1
list.updateWithFn(
    [{ key: "name", matchFn: name => name === "John" }],
    [{ key: "age", updateFn: age => age + 1 }]
);

// Multiple field updates
list.updateWithFn(
    [{ key: "age", matchFn: age => age > 25 }],
    [
        { key: "age", updateFn: age => age * 1.1 },
        { key: "name", updateFn: name => name.toUpperCase() }
    ]
);

// ID mutation attempts are prevented
list.updateWithFn(
    [{ key: "name", matchFn: name => name === "John" }],
    [{ key: "id", updateFn: () => 999 }] // ID stays unchanged
);
```

### `.find(criteria)`
Finds items matching criteria. Returns array.
```javascript
// Find by age
list.find([{ key: "age", matchFn: age => age > 25 }]);

// Find by name pattern
list.find([{ key: "name", matchFn: name => name.includes("J") }]);

// Multiple criteria (AND)
list.find([
    { key: "age", matchFn: age => age > 20 },
    { key: "name", matchFn: name => name.startsWith("J") }
]);
```

### `.findById(id)`
Finds item by ID. Returns single item or undefined.
```javascript
list.findById(1); // { id: 1, name: "John", age: 30 }
list.findById(999); // undefined
```

### `.replaceItems(items)`
Replaces all items with a new array. Validates and clones the new items.
```javascript
// Replace with new data
list.replaceItems([
    { id: 10, name: "New User", age: 40 },
    { id: 20, name: "Another User", age: 50 }
]);

// Replace with empty array
list.replaceItems([]);

// Replace with data from API
list.replaceItems(apiResponse.data);
```

### `.sort({ key = "id", order = 1 })`
Sorts items by key. Mutates the list.
- `order: 1` = ascending, `order: -1` = descending
- Supports nested keys with dot notation

```javascript
// Sort by age (ascending)
list.sort({ key: "age" });
list.sort({ key: "age", order: 1 });

// Sort by name (descending)
list.sort({ key: "name", order: -1 });

// Sort by nested property
list.sort({ key: "address.city" });

// Sort by ID (default)
list.sort();
```

## Criteria Format
All search/update methods use criteria arrays:
```javascript
[{ key: "property", matchFn: value => boolean }]
```

### Common Match Functions
```javascript
// Exact match
{ key: "name", matchFn: name => name === "John" }

// Comparison
{ key: "age", matchFn: age => age > 30 }
{ key: "age", matchFn: age => age >= 18 && age <= 65 }

// String operations
{ key: "name", matchFn: name => name.startsWith("J") }
{ key: "email", matchFn: email => email.includes("@gmail.com") }

// Array operations
{ key: "tags", matchFn: tags => tags.includes("premium") }

// Type checks
{ key: "score", matchFn: score => typeof score === "number" }
{ key: "active", matchFn: active => active === true }
```

## Error Handling
- Constructor throws `TypeError` for non-arrays or invalid objects
- `add()` throws `TypeError` for invalid objects or duplicate IDs
- `replaceItems()` throws `TypeError` for non-arrays or invalid objects
- `sort()` throws `TypeError` for invalid options, keys, or missing properties

## ID Protection
- All update methods (`update()`, `updateById()`, `updateWithFn()`) prevent ID mutations
- Attempts to change an item's ID are silently ignored
- The original ID is always preserved after updates


