# JList Class Documentation

## sort() Method Specification

### Method Signature
```javascript
sort(options) -> void
```

### Parameters
- `options` (Object): Configuration object for sorting
  - `key` (String): The property name to sort by (supports dot notation for nested properties)
  - `order` (Number): Sort order
    - `1` = Ascending order (smallest to largest)
    - `-1` = Descending order (largest to smallest)

### Behavior
- Mutates the internal `#items` array directly (no return value)
- Sorts items based on the specified property key
- Supports nested property access using dot notation (e.g., `"location.city"`)
- Handles both numeric and string values appropriately
- Maintains original item structure and properties

### Examples

#### Numeric Sorting (Ascending)
```javascript
const list = new JList([
    { id: 7, name: "Peter", age: 44 },
    { id: 1, name: "Jack", age: 25 },
    { id: 25, name: "Mary", age: 38 }
]);

list.sort({ key: "age", order: 1 });
// list.items is now: [
//   { id: 1, name: "Jack", age: 25 },
//   { id: 25, name: "Mary", age: 38 },
//   { id: 7, name: "Peter", age: 44 }
// ]
```

#### String Sorting (Descending)
```javascript
list.sort({ key: "name", order: -1 });
// list.items is now sorted by name Z-A
```

#### Nested Property Sorting
```javascript
const list = new JList([
    { id: 77, name: "Peter", location: { city: "Washington" } },
    { id: 5, name: "Will", location: { city: "Detroit" } },
    { id: 31, name: "Karen", location: { city: "Atlanta" } }
]);

list.sort({ key: "location.city", order: 1 });
// list.items is now: [
//   { id: 31, name: "Karen", location: { city: "Atlanta" } },
//   { id: 5, name: "Will", location: { city: "Detroit" } },
//   { id: 77, name: "Peter", location: { city: "Washington" } }
// ]
```

### Error Handling
- Throws `TypeError` if `options` is not an object
- Throws `TypeError` if `key` is not a string
- Throws `TypeError` if `order` is not 1 or -1
- Throws `TypeError` if specified key path doesn't exist on items

### Implementation Notes
- Uses JavaScript's native `Array.sort()` with custom comparator
- Mutates the internal `#items` array directly
- Supports nested property access by splitting key on dots and traversing object properties
- Handles `undefined` values by placing them at the end
- Case-sensitive string sorting (can be enhanced for case-insensitive)
- For nested keys, validates that the full property path exists on all items