class TodoGridSrv {
	static #instance = null; // Private static field
	
	// Constants for maximum grid size
	static MAX_COLUMNS = 15;
	static MAX_ROWS = 15;
	static STORAGE_KEY = 'betaTodoBoardMatrix';
	static DEFAULT_CONFIG = {
		columns: 6,
		rows: 8,
		activeBoard: 1
	};
	static DEFAULT_BOARD = {
		id: 1,
		name: 'Default Board'
	};
	
	constructor() {
		if (TodoGridSrv.#instance) {
			throw new Error('TodoGridSrv is a singleton. Use getInstance() instead.');
		}
		
		TodoGridSrv.#instance = this;
	}
	
	static getInstance() {
		if (!TodoGridSrv.#instance) {
			TodoGridSrv.#instance = new TodoGridSrv();
		}
		return TodoGridSrv.#instance;
	}
	
	// ============================================================================
	// GRID INITIALIZATION & PERSISTENCE
	// ============================================================================
	
	/**
	 * Creates an empty grid matrix at maximum size
	 * @return {Array<Array<null>>} Empty 15x15 matrix
	 */
	initializeGrid() {
		return Array(TodoGridSrv.MAX_ROWS).fill(null).map(() =>
			Array(TodoGridSrv.MAX_COLUMNS).fill(null)
		);
	}

	/**
	 * Expands an existing matrix to the current maximum size
	 * Preserves all existing data in their original positions
	 * @param {Array<Array>} matrix - The existing matrix to expand
	 * @return {Array<Array<null>>} Expanded matrix at maximum size
	 */
	expandMatrix(matrix) {
		if (!matrix || !Array.isArray(matrix)) {
			return this.initializeGrid();
		}

		// Create new matrix at maximum size filled with null
		const expandedMatrix = Array(TodoGridSrv.MAX_ROWS).fill(null).map(() =>
			Array(TodoGridSrv.MAX_COLUMNS).fill(null)
		);

		// Copy existing data from smaller matrix (preserve positions)
		for (let row = 0; row < Math.min(matrix.length, TodoGridSrv.MAX_ROWS); row++) {
			if (matrix[row] && Array.isArray(matrix[row])) {
				for (let col = 0; col < Math.min(matrix[row].length, TodoGridSrv.MAX_COLUMNS); col++) {
					if (matrix[row][col]) {
						expandedMatrix[row][col] = matrix[row][col];
					}
				}
			}
		}

		return expandedMatrix;
	}
	
	/**
	 * Loads multi-board grid data from localStorage
	 * @return {{config: Object, boardItems: Array, matrixData: Object}} Multi-board data structure
	 */
	loadGridFromStorage() {
		const stored = localStorage.getItem(TodoGridSrv.STORAGE_KEY);
		if (stored) {
			try {
				const data = JSON.parse(stored);
				
				// Check if this is the new multi-board format
				if (data.boardItems && data.matrixData && data.config) {
					// Check if any matrix needs expansion to current max size
					const expandedMatrixData = {};
					let needsExpansion = false;

					for (const boardId in data.matrixData) {
						const matrix = data.matrixData[boardId];
						if (matrix && (matrix.length < TodoGridSrv.MAX_ROWS ||
							(matrix[0] && matrix[0].length < TodoGridSrv.MAX_COLUMNS))) {
							expandedMatrixData[boardId] = this.expandMatrix(matrix);
							needsExpansion = true;
						} else {
							expandedMatrixData[boardId] = matrix;
						}
					}

					const result = {
						config: data.config,
						boardItems: data.boardItems,
						matrixData: expandedMatrixData
					};

					// Save expanded data if any expansion was needed
					if (needsExpansion) {
						this.saveGridToStorage(result);
					}

					return result;
				}
				
				// Handle old single-board format - migrate to multi-board
				if (data.matrix && data.config) {
					console.log('Migrating single-board data to multi-board format');
					const migratedMatrix = this.expandMatrix(data.matrix);
					
					const multiboardData = {
						config: {
							columns: data.config.columns,
							rows: data.config.rows,
							activeBoard: 1
						},
						boardItems: [{ ...TodoGridSrv.DEFAULT_BOARD }],
						matrixData: {
							'1': migratedMatrix
						}
					};
					
					// Save the migrated data
					this.saveGridToStorage(multiboardData);
					return multiboardData;
				}
			} catch (e) {
				console.warn('Failed to load grid from storage:', e);
			}
		}
		
		// Return default multi-board structure
		const defaultData = {
			config: { ...TodoGridSrv.DEFAULT_CONFIG },
			boardItems: [{ ...TodoGridSrv.DEFAULT_BOARD }],
			matrixData: {
				'1': this.initializeGrid()
			}
		};
		
		this.saveGridToStorage(defaultData);
		return defaultData;
	}
	
	/**
	 * Saves multi-board grid data to localStorage
	 * @param {Object} data - Complete multi-board data structure
	 */
	saveGridToStorage(data) {
		localStorage.setItem(TodoGridSrv.STORAGE_KEY, JSON.stringify(data));
	}
	
	// ============================================================================
	// BOARD MANAGEMENT METHODS
	// ============================================================================
	
	/**
	 * Creates a new board with the given name
	 * @param {string} name - Name for the new board
	 * @param {Object} currentData - Current multi-board data
	 * @return {Object} Updated multi-board data with new board
	 */
	createBoard(name, currentData) {
		const newBoardId = Math.max(...currentData.boardItems.map(b => b.id), 0) + 1;
		const newBoard = {
			id: newBoardId,
			name: name
		};
		
		const updatedData = {
			...currentData,
			boardItems: [...currentData.boardItems, newBoard],
			matrixData: {
				...currentData.matrixData,
				[newBoardId]: this.initializeGrid()
			}
		};
		
		return updatedData;
	}
	
	/**
	 * Gets all todo IDs from a specific board's matrix
	 * @param {number} boardId - Board ID to collect todos from
	 * @param {Object} multiboardData - Complete multi-board data
	 * @return {Array<number>} Array of todo IDs found in the board
	 */
	getTodoIdsFromBoard(boardId, multiboardData) {
		const matrix = multiboardData.matrixData[boardId];
		const config = multiboardData.config;
		const todoIds = [];
		
		if (matrix) {
			for (let row = 0; row < config.rows; row++) {
				for (let col = 0; col < config.columns; col++) {
					if (matrix[row] && matrix[row][col]) {
						todoIds.push(matrix[row][col]);
					}
				}
			}
		}
		
		return todoIds;
	}

	/**
	 * Deletes a board (if it's not the last one)
	 * @param {number} boardId - ID of board to delete
	 * @param {Object} currentData - Current multi-board data
	 * @return {Object|null} Updated data or null if deletion not allowed
	 */
	deleteBoard(boardId, currentData) {
		// Don't allow deleting the last board
		if (currentData.boardItems.length <= 1) {
			return null;
		}
		
		const updatedBoardItems = currentData.boardItems.filter(board => board.id !== boardId);
		const updatedMatrixData = { ...currentData.matrixData };
		delete updatedMatrixData[boardId];
		
		// If deleting the active board, switch to the first remaining board
		let updatedConfig = { ...currentData.config };
		if (updatedConfig.activeBoard === boardId) {
			updatedConfig.activeBoard = updatedBoardItems[0].id;
		}
		
		return {
			config: updatedConfig,
			boardItems: updatedBoardItems,
			matrixData: updatedMatrixData
		};
	}
	
	/**
	 * Renames a board
	 * @param {number} boardId - ID of board to rename
	 * @param {string} newName - New name for the board
	 * @param {Object} currentData - Current multi-board data
	 * @return {Object} Updated multi-board data
	 */
	renameBoard(boardId, newName, currentData) {
		const updatedBoardItems = currentData.boardItems.map(board => 
			board.id === boardId ? { ...board, name: newName } : board
		);
		
		return {
			...currentData,
			boardItems: updatedBoardItems
		};
	}
	
	/**
	 * Gets the list of boards
	 * @param {Object} currentData - Current multi-board data
	 * @return {Array} Array of board objects
	 */
	getBoardList(currentData) {
		return currentData.boardItems;
	}
	
	/**
	 * Switches the active board
	 * @param {number} boardId - ID of board to make active
	 * @param {Object} currentData - Current multi-board data
	 * @return {Object} Updated multi-board data with new active board
	 */
	switchActiveBoard(boardId, currentData) {
		return {
			...currentData,
			config: {
				...currentData.config,
				activeBoard: boardId
			}
		};
	}

	// ============================================================================
	// GRID CONFIGURATION VALIDATION
	// ============================================================================
	
	/**
	 * Validates and adjusts column count
	 * @param {number} currentColumns - Current column count
	 * @param {number} delta - Change amount (+1 or -1)
	 * @return {number|null} New column count or null if invalid
	 */
	adjustColumns(currentColumns, delta) {
		const newColumns = currentColumns + delta;
		if (newColumns >= 3 && newColumns <= TodoGridSrv.MAX_COLUMNS) {
			return newColumns;
		}
		return null;
	}
	
	/**
	 * Validates and adjusts row count
	 * @param {number} currentRows - Current row count
	 * @param {number} delta - Change amount (+1 or -1)
	 * @return {number|null} New row count or null if invalid
	 */
	adjustRows(currentRows, delta) {
		const newRows = currentRows + delta;
		if (newRows >= 5 && newRows <= TodoGridSrv.MAX_ROWS) {
			return newRows;
		}
		return null;
	}
	
	// ============================================================================
	// POSITION UTILITIES
	// ============================================================================
	
	/**
	 * Finds the position of a todo in a specific board's grid matrix
	 * @param {number} todoId - Todo ID to find
	 * @param {number} boardId - Board ID to search in
	 * @param {Object} multiboardData - Complete multi-board data
	 * @return {{row: number|null, column: number|null}} Position or null values
	 */
	getTodoPosition(todoId, boardId, multiboardData) {
		const matrix = multiboardData.matrixData[boardId];
		if (!matrix || !todoId) return { row: null, column: null };
		
		const config = multiboardData.config;
		for (let r = 0; r < config.rows; r++) {
			for (let c = 0; c < config.columns; c++) {
				if (matrix[r] && matrix[r][c] === todoId) {
					return { row: r, column: c };
				}
			}
		}
		
		return { row: null, column: null };
	}
	
	/**
	 * Finds the next available slot in a specific board's grid matrix
	 * @param {number} boardId - Board ID to search in
	 * @param {Object} multiboardData - Complete multi-board data
	 * @param {number} [startColumn=0] - Column to start search from
	 * @param {number} [startRow=0] - Row to start search from
	 * @return {{row: number|null, column: number|null}} Next available position
	 */
	getNextAvailableSlot(boardId, multiboardData, startColumn = 0, startRow = 0) {
		const matrix = multiboardData.matrixData[boardId];
		if (!matrix) return { column: null, row: null };

		const config = multiboardData.config;
		for (let c = startColumn; c < config.columns; c++) {
			for (let r = (c === startColumn ? startRow : 0); r < config.rows; r++) {
				if (!matrix[r]) continue;
				if (!matrix[r][c]) {
					return { row: r, column: c };
				}
			}
		}

		return { column: null, row: null };
	}
	
	// ============================================================================
	// GRID OPERATIONS
	// ============================================================================
	
	/**
	 * Handles moving a todo from one position to another (drag & drop)
	 * @param {number} todoId - Todo ID being moved
	 * @param {number} targetRow - Target row position
	 * @param {number} targetColumn - Target column position
	 * @param {number} boardId - Board ID where the move happens
	 * @param {Object} multiboardData - Complete multi-board data
	 * @return {Object} Updated multi-board data
	 */
	moveTodo(todoId, targetRow, targetColumn, boardId, multiboardData) {
		const matrix = multiboardData.matrixData[boardId];
		const config = multiboardData.config;
		
		// Find current position of the todo
		let currentRow = -1, currentColumn = -1;
		
		for (let r = 0; r < config.rows; r++) {
			for (let c = 0; c < config.columns; c++) {
				if (matrix[r][c] === todoId) {
					currentRow = r;
					currentColumn = c;
					break;
				}
			}
			if (currentRow !== -1) break;
		}
		
		if (currentRow !== -1 && currentColumn !== -1) {
			// Create a copy of the matrix
			const newMatrix = matrix.map(row => [...row]);
			
			// Swap positions
			const targetTodoId = newMatrix[targetRow][targetColumn];
			newMatrix[currentRow][currentColumn] = targetTodoId;
			newMatrix[targetRow][targetColumn] = todoId;
			
			return {
				...multiboardData,
				matrixData: {
					...multiboardData.matrixData,
					[boardId]: newMatrix
				}
			};
		}
		
		return multiboardData; // Return unchanged if todo not found
	}
	
	/**
	 * Places a todo in a specific position
	 * @param {number} todoId - Todo ID to place
	 * @param {number} row - Row position
	 * @param {number} column - Column position
	 * @param {number} boardId - Board ID where to place the todo
	 * @param {Object} multiboardData - Complete multi-board data
	 * @return {Object} Updated multi-board data
	 */
	placeTodo(todoId, row, column, boardId, multiboardData) {
		const matrix = multiboardData.matrixData[boardId];
		const newMatrix = matrix.map(matrixRow => [...matrixRow]);
		newMatrix[row][column] = todoId;
		
		return {
			...multiboardData,
			matrixData: {
				...multiboardData.matrixData,
				[boardId]: newMatrix
			}
		};
	}
	
	/**
	 * Removes a todo from a specific board's grid matrix
	 * @param {number} todoId - Todo ID to remove
	 * @param {number} boardId - Board ID where to remove the todo
	 * @param {Object} multiboardData - Complete multi-board data
	 * @return {Object} Updated multi-board data
	 */
	removeTodo(todoId, boardId, multiboardData) {
		const position = this.getTodoPosition(todoId, boardId, multiboardData);
		if (position.row !== null && position.column !== null) {
			const matrix = multiboardData.matrixData[boardId];
			const newMatrix = matrix.map(row => [...row]);
			newMatrix[position.row][position.column] = null;
			
			return {
				...multiboardData,
				matrixData: {
					...multiboardData.matrixData,
					[boardId]: newMatrix
				}
			};
		}
		return multiboardData; // Return unchanged if todo not found
	}
	
	// ============================================================================
	// GETTERS FOR CONSTANTS
	// ============================================================================
	
	get maxColumns() { return TodoGridSrv.MAX_COLUMNS; }
	get maxRows() { return TodoGridSrv.MAX_ROWS; }
	get defaultConfig() { return { ...TodoGridSrv.DEFAULT_CONFIG }; }
}

export const todoGridSrv = TodoGridSrv.getInstance();

