# Todo Board Feature Specification

## Core Functionality

### Slot-Based Grid System
- **Grid Configuration**: User sets columns × rows via inline +/- controls (default: 6×8 = 48 slots)
- **Fixed Workspace**: No scrolling, work within slot limitations  
- **Slot Management**: Each slot contains 0 or 1 todo item
- **Drag & Drop**: Move todos between any slots with visual feedback
- **Auto-placement**: New todos automatically placed in next available slot

### Todo Item Operations
- **Create**: Add new todo via inline input field, automatically placed in next available slot
- **Read**: Display todos in their assigned grid positions with position indicators
- **Update**: Edit todo details, move between slots via drag-and-drop, change colors
- **Delete**: Remove todo items via color selector delete button, frees up slots
- **Color Change**: Click 3-dots menu button to show color selector
- **Title Toggle**: "T" button in color selector toggles TITLE/DEFAULT task type
- **Inline Edit**: Double-click description to edit text inline (TAB to save, ENTER for new line)

### Workspace Configuration
- **Columns**: Configurable via inline +/- controls (3-10 range)
- **Rows**: Configurable via inline +/- controls (5-10 range)
- **Maximum Matrix**: Fixed 10×10 to prevent data loss during resizing
- **Persistence**: Save configuration and matrix in localStorage

### Todo Types
- **TITLE TASK**: when `starred: true` (important/highlighted)
- **DEFAULT TASK**: when `starred: false` (regular todos)

### Todo Properties
- **done: false/true**: Completion status
- **starred: true/false**: Determines task type (TITLE vs DEFAULT)
- **color**: Category identifier ($D, $A, etc.)
- **matrix**: Separate 2D array tracking todo positions

## Data Model

### Todo Entity
```javascript
{
  id: number,
  desc: string,        // todo description/title
  color: string,       // category color ($D, $A, etc.)
  starred: boolean,    // marked as important
  done: boolean        // completion status
  // No position data stored in todo
}
```

### Grid Matrix
```javascript
{
  matrix: number[][],        // 2D array holding todo IDs
  config: {
    columns: number,         // number of columns (default: 6)
    rows: number,           // number of rows (default: 8)
  }
}
```

### Example Grid Matrix (3×3)
```javascript
matrix: [
  [null, 15, null],    // row 0: empty, todo id 15, empty
  [7, null, 23],       // row 1: todo id 7, empty, todo id 23
  [null, null, null]   // row 2: all empty
]
```

## Technical Implementation

### Component Structure
- **TodoBoard.vue**: Main grid component with inline controls and todo input
- **TodoSlot.vue**: Individual slot container (empty or with todo)
- **TodoCard.vue**: Todo item card with TITLE/DEFAULT styling, position display, and 3-dots menu
- **ColorSelector.vue**: Click-triggered color picker with delete button

### Grid Layout Implementation
- **CSS Grid**: `grid-template-columns` and `grid-template-rows`
- **Responsive Sizing**: Cards auto-size to fit viewport
- **Slot Positioning**: Grid-based layout with drag-and-drop zones
- **Empty Slot Styling**: Dashed borders with "+" indicator for available slots
- **Task Styling**: Visual distinction between TITLE (starred=transparent bg) and DEFAULT tasks
- **Position Display**: Each card shows "C#/R#" position indicator in bottom-left corner
- **Text Alignment**: TOP-LEFT alignment with tight line-height for compact display
- **Dark Theme**: Stone-based color palette with hover effects
- **Tailwind CSS**: All styling uses Tailwind classes (consistent with existing codebase)

### Color Selector Feature
- **Trigger**: 3-dots menu button in top-right corner of each card
- **Title Toggle**: "T" button toggles TITLE TASK (starred property)
- **Color Options**: 5 color swatches ($D=yellow, $A=blue, $B=purple, $C=green, $E=orange)
- **Delete Function**: Red delete button to remove todo and clear grid position
- **Auto-close**: Selector closes automatically after any selection
- **Visual Feedback**: Current color and title state highlighted in selector

### Inline Text Editing
- **Edit Mode**: Double-click description text to enter edit mode
- **Textarea**: Switch to textarea for multi-line editing
- **Save**: TAB key exits edit mode and saves changes
- **New Line**: ENTER key creates new line within text
- **Auto-save**: Changes saved on TAB or focus loss

### State Management
- **Grid Matrix**: Stored in localStorage (key: 'betaTodoBoardMatrix') with config
- **Todo Data**: Stored in IndexedDB via Vuex store (separate from position data)
- **Fixed Matrix Size**: 10×10 maximum to prevent data loss during grid resizing
- **Real-time Updates**: Automatic localStorage sync on all grid operations
- **Position Tracking**: `getTodoPosition()` function searches matrix for todo IDs

### Grid Operations
- **Get Todo at Position**: `matrix[row][column]` returns todo ID
- **Find Todo Position**: iterate matrix to locate todo ID
- **Move Todo**: update matrix indices, swap IDs
- **Add Todo**: find empty slot (null), assign todo ID
- **Remove Todo**: set matrix position to null

### Drag and Drop
- Slot-to-slot drag updates matrix positions
- Swap matrix values between source/target slots
- Visual feedback for valid/invalid drop zones
- Matrix validation (prevent out-of-bounds)

## UI Components (Reuse Existing)
- **BxButton**: For grid controls (+/-), Add button, and color selector actions
- **BxIcon**: For back navigation and visual indicators
- **BxIconButton**: For delete functionality in color selector
- **Font classes**: Custom font (font-cc) for card content
- **Tailwind utilities**: All styling via existing utility classes

## Next Steps

### Testing & Quality Assurance
- **Manual Testing**: Test all drag-and-drop functionality across different grid sizes
- **Edge Cases**: Test grid resizing with existing todos (overflow handling)
- **Data Persistence**: Verify localStorage save/load functionality works correctly
- **Browser Compatibility**: Test drag-and-drop across different browsers
- **Responsive Design**: Ensure grid layout works on different screen sizes

### User Experience Enhancements
- ✅ **Delete Functionality**: Implemented via color selector delete button
- **Keyboard Navigation**: Implement arrow key navigation between slots
- **Bulk Operations**: Select multiple todos for batch color changes or moves
- **Search/Filter**: Add search bar to highlight todos matching criteria
- **Undo/Redo**: Implement action history for drag-and-drop operations
- **Grid Presets**: Quick size presets (small/medium/large grid configurations)

### Performance Optimizations
- **Virtual Scrolling**: Consider for very large grids (>100 slots)
- **Debounced Saves**: Reduce localStorage writes during rapid drag operations
- **Component Lazy Loading**: Load todo components only when visible
- **Memory Management**: Clean up event listeners and refs properly

### Data Management
- **Export/Import**: Add JSON export/import functionality for backup/sharing
- **Data Validation**: Add schema validation for localStorage data
- **Migration Scripts**: Handle data format changes in future versions
- **Conflict Resolution**: Handle concurrent edits if multi-user support added

### Advanced Features
- **Todo Templates**: Quick-create todos with predefined colors/categories
- **Time Tracking**: Add optional time estimation and tracking per todo
- **Due Dates**: Optional deadline functionality with visual indicators
- **Attachments**: Support for file attachments or links
- **Collaboration**: Real-time multi-user editing (requires backend)

### Integration & Deployment
- **Routing**: Ensure todo board integrates properly with app navigation
- **State Management**: Consider Vuex/Pinia if todo data needs global access
- **API Integration**: Connect to backend service for persistent storage
- **Performance Monitoring**: Add analytics for feature usage
- **Error Tracking**: Implement error boundary and logging for issues