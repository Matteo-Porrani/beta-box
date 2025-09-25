# BetaBox changelog

## `v0.3.3` - 2025-09-24

### New Features:
- **TodoBoard Grid Expansion**: Grid capacity expanded from 10x10 to 15x15 with automatic migration
- **Dynamic Text Sizing**: Added dynamic text sizing control for todo cards
- **Enhanced Testing**: Comprehensive educational comments added to TodoCard test suite

### Bug Fixes:
- Fixed Vue 3 imports for defineProps and defineEmits in TodoCard component
- Removed unnecessary Vue imports and improved component structure

### Improvements:
- Enhanced TodoBoard toolbar with text size control and refined spacing
- Improved code organization through composables extraction

### Key Files Modified:
- `src/modules/activity/components/todo/TodoCard.vue` - Vue 3 compatibility and text sizing
- `src/modules/activity/components/todo/TodoBoard.vue` - Grid expansion and toolbar enhancements
- Test files with comprehensive educational comments

## `v0.3.2` - 2025-09-23

### New Features:
- **Task Duplication**: Added duplicate task feature for TodoBoard
- **Enhanced Positioning**: Optional startColumn and startRow parameters for precise task placement

### Improvements:
- Simplified CSS classes in TodoCard.vue component
- Reviewed and improved board header design
- UI/UX refinements across TodoBoard components

## `v0.3.1` - 2025-09-21

### Major Features:
- **Multi-Board System**: Complete implementation of multi-board functionality
  - 8-part implementation series for comprehensive multi-board support
  - Enhanced board management and navigation
  - Improved board switching and state management

### Architecture Improvements:
- **New TodoGridSrv Service**: Centralized grid logic and operations
- **Code Organization**: Methods reorganization for better maintainability
- **Component Cleanup**: Removed unused GridConfig.vue and modal elements

### UI/UX Enhancements:
- Enhanced color selector display and functionality
- Simplified grid configuration controls
- Improved task creation and editing workflows
- Better visual feedback and interaction patterns
- Fixed task deletion issues and placement problems

### Key Files Added:
- `src/modules/activity/services/TodoGridSrv.js` - Core grid service
- Multi-board specification and implementation files

## TodoBoard Implementation (2025-09-20)

### Initial Implementation:
- **TodoBoard Component**: Complete TodoBoard.vue implementation V1
- **Routing Integration**: Added routing support for TodoBoard navigation
- **Task Object System**: Integrated Task objects into the grid system
- **Core Functionality**:
  - Task creation, editing, and deletion
  - Grid-based layout system
  - Color selection and visual customization
  - Interactive task management

### Foundation Work:
- Initial specifications and planning
- Core component architecture
- Data structure initialization
- Integration with existing activity module

## `v0.3.0`

### New Features:
- `JList` class: Core data structure with full CRUD
- Drag & Drop system: New `TheDragDropWrapper` component with live reordering
- Daily Speech Board: addition to activity module to reorganize activities of the day for daily speech
- New` useActivityType` composable for shared logic between activity components

### Key Files Added:
- `src/modules/core/classes/JList.js` - Core list data structure
- `test/modules/core/JList.test.js` - Comprehensive test suite
- `src/modules/core/components/TheDragDropWrapper.vue` - Drag/drop wrapper component
- `src/modules/activity/views/DailySpeechBoard.vue` - New activity board view

### Documentation:
- Added entities diagram and `JList` implementation plan

