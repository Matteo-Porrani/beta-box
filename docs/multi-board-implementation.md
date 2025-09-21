# Multi-Board Todo System Implementation Guide

## Overview and Motivation

Currently, our todo board application works with a single grid where all todos must coexist in one workspace. While this works for simple use cases, users quickly find themselves wanting to organize different types of work into separate boards. Imagine a developer who wants one board for "Current Sprint Tasks," another for "Bug Fixes," and a third for "Personal Learning Goals." Right now, they'd have to mix everything together, which reduces the organizational power of our grid system.

The solution is to evolve our single-board architecture into a multi-board system where users can create, switch between, and manage multiple independent todo grids. Each board will have its own name, its own grid matrix, but they'll all share the same global configuration for grid dimensions to maintain consistency.

## Current State Analysis

Let's start by understanding what we have today. Our localStorage structure is quite simple:

```javascript
{
    "matrix": [
        [14, null, null, null],
        [15, null, null, null],
        // more rows...
    ],
    "config": {
        "columns": 3,
        "rows": 7
    }
}
```

This works perfectly for a single board, but it doesn't scale when we need multiple independent workspaces. The matrix directly contains todo IDs, and there's no concept of separate boards or workspaces.

## Target Architecture

Since this is a completely new feature with no existing users, we can implement a clean multi-board structure without worrying about backward compatibility:

```javascript
{
    "config": {
        "columns": 3,
        "rows": 7,
        "activeBoard": 1
    },
    "boardItems": [
        { "id": 1, "name": "Default Board" },
        { "id": 2, "name": "Bug Fixes" },
        { "id": 3, "name": "Feature Development" }
    ],
    "matrixData": {
        "1": [
            [12, null, null],
            [13, null, null]
        ],
        "2": [
            [25, null, null],
            [67, null, null]
        ],
        "3": [
            [null, null, null],
            [null, null, null]
        ]
    }
}
```

Notice how we've separated concerns: the global configuration applies to all boards, the board metadata lives in `boardItems` with just essential information (id and name), and each board's actual todo arrangement lives in `matrixData` keyed by board ID.

## Service Layer Transformation

The heart of our changes will be in the `TodoGridSrv.js` service, which currently handles all grid operations for a single board. We need to extend every method to work with multiple boards while maintaining the same clean API for the component layer.

### Initial Data Structure

Since we're starting fresh, the service can initialize with a clean multi-board structure from the beginning. When no data exists in localStorage, we'll create a default setup with a single board called "Default Board" to give users a starting point.

### Board Management Methods

We'll need entirely new methods for board lifecycle management:

- `createBoard(name)` should generate a new board ID, create an entry in `boardItems` with the provided name, and initialize an empty matrix in `matrixData` for that board ID.
- `deleteBoard(boardId)` should remove the board from both `boardItems` and `matrixData`, but it should have safeguards - you shouldn't be able to delete the last remaining board, for instance.
- `renameBoard(boardId, newName)` should update the board's name in the `boardItems` array.
- `getBoardList()` should return the array of boards for UI consumption.
- `switchActiveBoard(boardId)` should update the global config to track which board is currently active.

### Matrix Operation Updates

Every existing method that operates on the grid matrix needs to be updated to work with a specific board. Instead of operating on "the matrix," they'll operate on "the matrix for board X."

For example, `getTodoPosition(todoId)` will become `getTodoPosition(todoId, boardId)`. The method will look up the specific matrix for that board in the `matrixData` object and then perform the same position-finding logic it does today.

Similarly, `moveTodo`, `placeTodo`, and `removeTodo` will all need to accept a board ID parameter and operate on the appropriate board's matrix. The internal logic remains the same - we're just adding an extra layer of indirection to specify which board we're working with.

### Persistence Strategy

The `saveGridToStorage` method needs to become smarter. Instead of saving a simple structure, it needs to save the full multi-board format. The `loadGridFromStorage` method needs to handle both old and new formats gracefully, performing migration when necessary.

We should also consider adding a version field to the stored data so that future migrations can be handled more elegantly.

## Component Layer Adaptations

The `TodoBoard.vue` component will need significant updates, but we want to keep these changes as contained as possible. The goal is to add multi-board functionality without disrupting the existing grid interaction patterns that users are already familiar with.

### Board Selection Interface

We need to add a simple board selector to the toolbar, probably between the back button and the todo input field. This will be a standard HTML `<select>` dropdown that shows the current board name and allows users to switch to a different board. When a user selects a different board, we should save their choice and load that board's matrix data.

We'll also add a "New Board" button next to the selector that prompts the user for a board name using a simple `prompt()` dialog for now. This keeps the UI simple and focused.

### State Management Updates

The component currently tracks a single `gridMatrix` ref and a single `gridConfig` reactive object. We'll need to add a `currentBoardId` ref to track which board is active. When the board changes, we'll need to load the appropriate matrix data from the service and update our local `gridMatrix` state.

We also need to think about what happens when users switch boards. Should we save their current work immediately? Should we warn them if they have unsaved changes? For simplicity, we'll probably auto-save the current board's state before switching to a new board.

### Method Signature Updates

Every method that currently calls into the service will need to pass the current board ID. For example, `handleTodoDrop` will need to call `todoGridSrv.moveTodo(gridMatrix.value, todoId, targetRow, targetColumn, gridConfig, currentBoardId.value)`.

This is a bit verbose, but it keeps the service methods pure and testable while making the board context explicit at the call site.

## User Experience Considerations

From a UX perspective, we want this to feel like a natural extension of the existing system, not a complete redesign. Users will start with a default board and can create additional boards when they need them.

The board switching should be fast and seamless. When a user switches boards using the dropdown, they should immediately see that board's todos arranged in their saved positions. There shouldn't be any loading states or delays that break the flow of their work.

For now, we'll keep the interface simple with just a dropdown selector and a basic "New Board" button. Advanced features like keyboard shortcuts can be added later if users request them.

## Implementation Phases

Rather than trying to implement everything at once, we should break this work into logical phases:

**Phase 1: Service Foundation** - Update the service layer to handle the new data structure and implement all the board management methods. Make sure the migration from single-board to multi-board works correctly.

**Phase 2: Basic Board Switching** - Add the minimal UI needed to switch between boards. This means adding the board selector dropdown and the logic to switch the current board and reload the grid matrix.

**Phase 3: Board Management** - Add the ability to create, rename, and delete boards directly from the UI.

**Phase 4: Polish and Enhancement** - Add keyboard shortcuts, better visual feedback, and any other UX improvements that become apparent during testing.

This phased approach allows us to validate each step before moving to the next, and it means we could potentially ship Phase 1 and 2 as a basic multi-board feature, then enhance it with the management features in later phases.

## Fresh Start Advantage

Since this is a new feature with no existing user data, we have the advantage of implementing a clean, optimal structure from the beginning. Users will start with a single "Default Board" and can immediately begin creating additional boards as needed.

This means we don't need complex migration logic or compatibility layers - we can focus on building the best possible multi-board experience from day one.

## Technical Implementation Notes

When implementing the service layer changes, we need to be careful about state management. The service should remain stateless - it shouldn't track which board is "current" internally. That responsibility should stay in the Vue component where it can be reactive and integrated with the component lifecycle.

The service methods should always require explicit board IDs when operating on board-specific data. This makes the API more verbose but also more explicit and less prone to bugs where operations accidentally happen on the wrong board.

For the UI implementation, we should leverage Vue's reactivity system to make board switching smooth. When `currentBoardId` changes, we can use a watcher to automatically load the new board's data and update the grid matrix. This keeps the board switching logic centralized and predictable.

## Conclusion

This multi-board implementation represents a significant evolution of our todo board system from a simple single-workspace tool to a more sophisticated organizational system. Since we're building this as a new feature without legacy constraints, we can focus on creating the cleanest, most intuitive multi-board experience possible.

The key is to keep the core simplicity that makes the todo board effective while adding the organizational power of multiple boards. Users should be able to organize their work into logical groups without the interface becoming complex or overwhelming.