
# Grid Size Expansion

Currently, in TodoBoard.vue the grid size is fixed to 10 columns and 10 rows.

I want to increase this to 15 columns and 15 rows.
But we need to be careful not to break the existing functionality,
since existing grids are stored in localStorage and their matrix is 10x10.

We should implement a function that updates the matrix every time
we detect a grid matrix smaller than 15x15.

# Implementation Plan

## Current Analysis
- Grid size is controlled by `TodoGridSrv.MAX_COLUMNS = 10` and `TodoGridSrv.MAX_ROWS = 10` in `src/modules/activity/services/TodoGridSrv.js:5-6`
- The system already has migration logic for converting single-board to multi-board format
- Grid matrices are stored in localStorage with structure: `{config, boardItems, matrixData}`
- All new grids are initialized at full MAX size (currently 10x10) with the `initializeGrid()` method
- The `loadGridFromStorage()` function already handles data migration scenarios

## Implementation Strategy

### 1. Update Constants
- Change `MAX_COLUMNS` and `MAX_ROWS` from 10 to 15 in `TodoGridSrv.js:5-6`

### 2. Create Matrix Migration Function
Add new method `expandMatrix(matrix)` in TodoGridSrv to safely expand existing matrices:
```javascript
expandMatrix(matrix) {
    // Create 15x15 matrix filled with null
    const expandedMatrix = Array(15).fill(null).map(() => Array(15).fill(null));

    // Copy existing data from smaller matrix (preserve positions)
    for (let row = 0; row < Math.min(matrix.length, 15); row++) {
        for (let col = 0; col < Math.min(matrix[row]?.length || 0, 15); col++) {
            if (matrix[row] && matrix[row][col]) {
                expandedMatrix[row][col] = matrix[row][col];
            }
        }
    }

    return expandedMatrix;
}
```

### 3. Integrate Migration into Load Process
Modify `loadGridFromStorage()` around line 58 to detect and expand matrices:
- Check if any matrix in `matrixData` is smaller than 15x15
- Automatically expand all board matrices during load
- Ensure backward compatibility with existing 10x10 data

### 4. Update Grid UI Controls
- Update maximum limits in grid controls in `TodoBoard.vue:91` and `TodoBoard.vue:110`
- Change `MAX_COLUMNS` and `MAX_ROWS` references

## Key Safety Measures
- **Backward Compatibility**: Existing 10x10 grids will be seamlessly expanded
- **Data Preservation**: All existing todos maintain their exact positions
- **Non-destructive**: Migration only adds new empty slots (null values)
- **Automatic**: No user intervention required
- **Idempotent**: Running migration multiple times won't cause issues

## Files to Modify
1. `src/modules/activity/services/TodoGridSrv.js` - Core logic and constants
2. `src/modules/activity/views/TodoBoard.vue` - UI limits (minimal change)

## Expected Behavior
- Existing users with 10x10 grids will automatically get 15x15 grids on next load
- All existing todos remain in their original positions
- New empty slots become available in rows 11-15 and columns 11-15
- Grid controls will allow expansion up to 15x15 instead of 10x10

This approach ensures zero data loss while enabling the larger 15x15 grid experience for all users.
