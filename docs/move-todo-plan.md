# Move Todo Between Boards - Implementation Plan

## Overview
Implement functionality to move a todo item from one board to another using the new arrow button in the ColorSelector component.

## Current State Analysis

### Existing Components
1. **ColorSelector.vue** (line 58-64)
   - Already has the move button with `@click="emit('move')"`
   - Emits 'move' event when clicked

2. **TodoCard.vue** (line 64)
   - Receives the move event: `@move="emit('move')"`
   - Currently emits 'move' but parent doesn't handle it

3. **TodoView.vue**
   - Has board management system via `useBoardManagement` composable
   - Has multiple boards stored in `multiboardData`
   - Has `currentBoardId` to track active board
   - Has `matrixData` that stores todo positions per board

## Implementation Plan

### Phase 1: Event Handling Setup
**File: TodoCard.vue (line 94)**
- ✓ Already emitting 'move' event (line 65)
- Add handler function that emits move with todo id:
  ```javascript
  function handleTodoMove() {
    emit('move', props.todo.id)
  }
  ```
- Update ColorSelector to call this handler (line 65)

### Phase 2: Modal for Board Selection
**File: TodoView.vue**

#### 2.1 Add Modal Template (after line 238)
- Create new `BxModal` for board selection
- Similar structure to existing board modal (lines 201-238)
- Display list of available boards (excluding current board)
- Components needed:
  - Modal header: "Move Todo to Board"
  - Modal body: List of board options with radio buttons or buttons
  - Modal footer: Cancel and Confirm buttons

#### 2.2 Add Reactive Data (after line 262)
```javascript
const moveTodoModal = ref(null)
const todoToMove = ref(null)
const targetBoardId = ref(null)
```

### Phase 3: Move Handler Function
**File: TodoView.vue (after line 413)**

#### 3.1 Show Board Selection Modal
```javascript
function handleTodoMove(todoId) {
  todoToMove.value = todoId
  targetBoardId.value = null
  moveTodoModal.value.open()
}
```

#### 3.2 Execute Move Operation
```javascript
function confirmTodoMove() {
  if (!todoToMove.value || !targetBoardId.value) return

  // 1. Find todo position in current board matrix
  const currentMatrix = matrixData.value[currentBoardId.value]
  let todoPosition = null

  for (let row = 0; row < currentMatrix.length; row++) {
    for (let col = 0; col < currentMatrix[row].length; col++) {
      if (currentMatrix[row][col] === todoToMove.value) {
        todoPosition = { row, col }
        break
      }
    }
    if (todoPosition) break
  }

  // 2. Remove from current board matrix
  if (todoPosition) {
    currentMatrix[todoPosition.row][todoPosition.col] = null
  }

  // 3. Find first empty slot in target board
  const targetMatrix = matrixData.value[targetBoardId.value]
  let placed = false

  for (let row = 0; row < targetMatrix.length && !placed; row++) {
    for (let col = 0; col < targetMatrix[row].length && !placed; col++) {
      if (!targetMatrix[row][col]) {
        targetMatrix[row][col] = todoToMove.value
        placed = true
      }
    }
  }

  // 4. Update matrix data and save
  matrixData.value = { ...matrixData.value }
  saveGridToStorage()

  // 5. Close modal and reset
  moveTodoModal.value.close()
  todoToMove.value = null
  targetBoardId.value = null
}

function cancelTodoMove() {
  moveTodoModal.value.close()
  todoToMove.value = null
  targetBoardId.value = null
}
```

### Phase 4: Wire Up Event Handler
**File: TodoView.vue (line 167)**
- Add move handler to TodoCard:
  ```vue
  @move="handleTodoMove"
  ```

### Phase 5: ColorSelector Event Update
**File: ColorSelector.vue (line 92)**
- Update emits array to include 'move':
  ```javascript
  const emit = defineEmits(['update', 'close', 'delete', 'copy', 'move'])
  ```
- ✓ Button already emits 'move' (line 63)

## Edge Cases to Handle

### 1. No Target Board Available
- Disable move button if only one board exists
- Or show message in modal: "No other boards available"

### 2. Target Board Matrix Full
- Check if target board has empty slots
- Show error message if full
- Alternative: Add to first available slot or expand matrix

### 3. Todo Not Found
- Validate todo exists before attempting move
- Handle gracefully if todo was deleted

### 4. Same Board Selected
- Filter out current board from selection list
- Or show warning if user somehow selects same board

## Testing Checklist

- [ ] Click move button opens board selection modal
- [ ] Modal shows all boards except current board
- [ ] Selecting a board and confirming moves the todo
- [ ] Todo disappears from source board
- [ ] Todo appears in target board's first empty slot
- [ ] Matrix data persists to localStorage correctly
- [ ] Cancel button closes modal without moving
- [ ] Works with starred (title) todos
- [ ] Works with colored todos
- [ ] Works with completed todos
- [ ] Handles edge case: only one board exists
- [ ] Handles edge case: target board is full

## UI/UX Considerations

1. **Visual Feedback**
   - Show loading state during move
   - Success notification after move
   - Animation for todo disappearing/appearing

2. **Board Selection UI**
   - Display board names clearly
   - Show board grid size (e.g., "Project Board (5x8)")
   - Highlight target board on hover
   - Use radio buttons or clickable cards

3. **Accessibility**
   - Keyboard navigation in modal
   - ESC key to cancel
   - Focus management

## Files to Modify

1. ✓ `src/modules/activity/components/todo/ColorSelector.vue` - Button exists, update emits
2. `src/modules/activity/components/todo/TodoCard.vue` - Update move handler
3. `src/modules/activity/views/TodoView.vue` - Add modal, handlers, and event wiring

## Estimated Implementation Time
- Phase 1: 10 minutes
- Phase 2: 30 minutes
- Phase 3: 45 minutes
- Phase 4: 5 minutes
- Phase 5: 5 minutes
- Testing: 30 minutes

**Total: ~2 hours**
