---
# PROMPT
Check all .vue components in @src/modules/activity folder.
Draw a simple diagram showing components family tree.
For each component, add a short description.
---


# Activity Module Component Family Tree

## Component Hierarchy Diagram

```
Activity Module
│
├── 📁 Views (Top-level pages)
│   ├── ActivityView.vue (Main activity management page)
│   │   ├── WeekSelector.vue (Week navigation)
│   │   └── ActivityGrid.vue (Week activity display)
│   │       ├── DayCard.vue (Individual day container)
│   │       └── ActivityCard.vue (Individual activity item)
│   │
│   ├── CalendarManager.vue (Week/calendar management)
│   │   ├── WeekDisplayItem.vue (Week list item display)
│   │   └── WeekCreator.vue (Create new weeks)
│   │
│   ├── SprintManager.vue (Sprint review/analysis)
│   │
│   ├── DailySpeechBoard.vue (Daily standup preparation)
│   │   └── DailySpeechActivityItem.vue (Draggable activity item)
│   │
│   └── TodoBoard.vue (Kanban-style task management)
│       ├── TodoSlot.vue (Grid slot for todos)
│       ├── TodoCard.vue (Individual todo item)
│       │   └── ColorSelector.vue (Todo styling options)
│       └── [Uses external drag/drop wrapper]
│
└── 📁 Components (Reusable pieces)
    ├── Activity Display
    │   ├── ActivityGrid.vue
    │   ├── ActivityCard.vue
    │   └── DayCard.vue
    │
    ├── Calendar Management
    │   ├── WeekSelector.vue
    │   ├── WeekDisplayItem.vue
    │   └── WeekCreator.vue
    │
    ├── Daily Speech
    │   └── DailySpeechActivityItem.vue
    │
    └── Todo Management
        ├── TodoCard.vue
        ├── TodoSlot.vue
        └── ColorSelector.vue
```

## Component Descriptions

### **Views (Main Pages)**

**ActivityView.vue** - `src/modules/activity/views/ActivityView.vue:81`
Main activity management interface using Options API. Displays weekly activity grid with modal form for CRUD operations on activities.

**CalendarManager.vue** - `src/modules/activity/views/CalendarManager.vue:48`
Week management interface using Composition API. Allows creating and viewing work weeks with date range selection.

**SprintManager.vue** - `src/modules/activity/views/SprintManager.vue:58`
Sprint analysis and review tool using Composition API. Generates PDF reports from sprint activities with date filtering.

**DailySpeechBoard.vue** - `src/modules/activity/views/DailySpeechBoard.vue:58`
Daily standup preparation interface using Options API. Provides drag-and-drop reordering of activities with comments section.

**TodoBoard.vue** - `src/modules/activity/views/TodoBoard.vue:188`
Kanban-style task management board using Composition API. Features grid-based layout with drag-and-drop todo management and multiple board support.

### **Activity Display Components**

**ActivityGrid.vue** - `src/modules/activity/components/ActivityGrid.vue:29`
5-column grid layout displaying week activities. Orchestrates DayCard and ActivityCard components with event delegation.

**ActivityCard.vue** - `src/modules/activity/components/ActivityCard.vue:68`
Individual activity display card with ticket integration. Shows duration, type, description, and linked tickets with edit functionality.

**DayCard.vue** - `src/modules/activity/components/DayCard.vue:58`
Daily activity container with visual progress bars. Displays date, total duration, activity type breakdown, and add activity button.

### **Week Management Components**

**WeekSelector.vue** - `src/modules/activity/components/WeekSelector.vue:57`
Week navigation dropdown with manager access buttons. Provides week selection and quick access to calendar/sprint managers.

**WeekDisplayItem.vue** - `src/modules/activity/components/calendar-manager/WeekDisplayItem.vue:24`
Read-only week display in list format using Composition API. Shows week ID and formatted day badges.

**WeekCreator.vue** - `src/modules/activity/components/calendar-manager/WeekCreator.vue:28`
Week creation form using Composition API. Provides date range selection for generating new work weeks.

### **Daily Speech Components**

**DailySpeechActivityItem.vue** - `src/modules/activity/components/DailySpeechActivityItem.vue:70`
Draggable activity card for standup preparation. Displays activity type, duration, tickets, and description with drag state styling.

### **Todo Management Components**

**TodoCard.vue** - `src/modules/activity/components/todo/TodoCard.vue:69`
Interactive todo item with inline editing using Composition API. Supports drag-and-drop, color coding, completion status, and contextual actions.

**TodoSlot.vue** - `src/modules/activity/components/todo/TodoSlot.vue:27`
Grid slot container for todo items using Composition API. Handles drag-and-drop operations with visual feedback for empty/occupied states.

**ColorSelector.vue** - `src/modules/activity/components/todo/ColorSelector.vue:68`
Todo styling options popup using Composition API. Provides color selection, title toggle, completion status, and action buttons (copy/delete).

## Architecture Notes

- **Mixed API Patterns**: The module uses both Options API (legacy components) and Composition API (newer components)
- **Modular Design**: Components are organized by feature area with clear separation of concerns
- **Event-Driven Communication**: Parent-child communication via events and props
- **Drag-and-Drop Support**: Multiple components integrate drag-and-drop functionality
- **External Dependencies**: Uses custom Bx UI components and external drag-drop wrapper

The activity module demonstrates a well-structured feature-based architecture with components ranging from simple display items to complex interactive interfaces for activity and task management.