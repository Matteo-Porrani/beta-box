# Beta Box - Vue 3 Project Guide

## Project Overview

Beta Box is a Vue 3 application built with a modular architecture and custom UI component library. 

The project focuses on project management, activity tracking, and task organization with a French locale configuration.

## Essential Commands

- **Development**: `npm run serve` - Start development server
- **Build**: `npm run build` - Create production build
- **Lint**: `npm run lint` - Run ESLint checks
- **Test**: `npm test` - Execute Vitest test suite

## Architecture Overview

### Module Structure
The application uses a feature-based modular architecture:

```
src/modules/
├── core/           # Layout, navigation, shared components
├── admin/          # Administrative functionality
├── activity/       # Activity tracking and calendar management
├── project/        # Project and ticket management
├── task/           # Task management
├── data-manager/   # Data export/import functionality
├── dev/            # Development utilities
└── ui/             # Custom UI component library (Bx components)
```

### Component Organization
- **Views**: Main page components in `modules/{feature}/views/`
- **Components**: Reusable components in `modules/{feature}/components/`
- **Services**: Business logic in `modules/{feature}/services/`

## Code Conventions

### JavaScript Style
- Use Vue 3 Composition API
- JavaScript-first approach with minimal TypeScript
- Use template strings for dynamic content
- Prefer `const` and `let` over `var`

### Vue Components
- Component names use PascalCase
- Props validation with default values
- Computed properties for derived state
- Methods for component logic

### Custom UI Components (Bx Library)
All custom components are prefixed with "Bx" and globally registered:

- `BxButton` - Primary button component
- `BxIcon` - Icon wrapper for Tabler icons
- `BxModal` - Modal dialog component
- `BxForm` - Form container with validation
- `BxTable` - Data table component
- `BxCalendar` - Calendar picker component

Usage: Components are auto-registered globally via `register-bx-ui.js`

### Styling
- **Primary**: Tailwind CSS utility classes
- **Icons**: Tabler Icons via `@tabler/icons-vue`
- **Custom**: Component-specific styles in `<style>` blocks
- Responsive design with Tailwind breakpoints

## State Management

### Vuex Store
- Central state management via Vuex 4
- Module-based store organization in `src/store/modules/`
- Actions for async operations
- Mutations for state changes

### Local Storage
- Dexie for IndexedDB operations
- Local data persistence for offline functionality

## Testing

### Vitest Configuration
- **Framework**: Vitest with jsdom environment
- **Testing Library**: Vue Testing Library for component tests
- **Globals**: Test globals enabled
- **Alias**: `@` maps to `/src`

### Test Patterns
- Component testing with Vue Test Utils
- Mock external dependencies
- Test user interactions and state changes

## Key Dependencies

### Core Libraries
- `vue` (3.5.x) - Vue.js framework
- `vue-router` (4.x) - Client-side routing
- `vuex` (4.x) - State management
- `axios` - HTTP client

### UI & Styling
- `@tabler/icons-vue` - Icon library
- `tailwindcss` - Utility-first CSS framework

### Utilities
- `moment` + `moment-range` + `moment-timezone` - Date/time handling (French locale)
- `dexie` - IndexedDB wrapper
- `jspdf` + `jspdf-autotable` - PDF generation
- `mitt` - Event emitter
- `shiki` - Syntax highlighting

### Development
- `vitest` - Test runner
- `@testing-library/vue` - Component testing utilities
- `eslint` - Code linting

## Common Patterns

### Component Registration
```javascript
// Global registration in register-bx-ui.js
app.component('BxButton', BxButton);
```

### Module Registration
```javascript
// In main.js
registerModules({
  core: coreModule,
  admin: adminModule,
  // ... other modules
});
```

### Date Handling
```javascript
// Moment.js with French locale
moment.locale("fr");
// Available globally as this.moment in components
```

### General
- NEVER use Playwright MCP unless I ask you to do so

### JavaScript
- Always use double quotes for strings (e.g. "abc")
- Always use modern ES6 features

### Tailwind Classes
- Use utility classes for spacing, colors, typography
- Custom component styles when utilities aren't sufficient
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

## File Naming Conventions

- **Components**: PascalCase (e.g., `ActivityCard.vue`)
- **Views**: PascalCase with "View" suffix (e.g., `ProjectView.vue`)
- **Services**: PascalCase with "Srv" suffix (e.g., `HttpSrv.ts`)
- **Types**: PascalCase (e.g., `Task.ts`)

