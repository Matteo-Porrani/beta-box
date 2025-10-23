Looking at the TodoBoard.vue file, it's definitely a large component at 550 lines. Here are some refactoring options to consider:

Immediate improvements:
- Extract board management logic into a composable (useBoardManagement.js)
- Extract todo CRUD operations into a composable (useTodoOperations.js)
- Extract grid configuration logic into a composable (useGridConfig.js)

Component splitting:
- Move the board modal into a separate BoardModal.vue component
- Extract the toolbar section into TodoBoardToolbar.vue
- Create a GridControls.vue component for the columns/rows controls

Most impactful first step:
Create src/modules/activity/composables/useBoardManagement.js to handle all the board-related state and methods (lines 437-542). 
This would remove ~100 lines and significantly improve readability.

The current component handles too many concerns - board management, todo operations, grid configuration, and UI state. 
Breaking it into focused composables would make it much more maintainable.

Would you like me to start with extracting the board management logic into a composable?