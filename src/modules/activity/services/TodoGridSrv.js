class TodoGridSrv {
	static #instance = null; // Private static field
	
	// Constants for maximum grid size
	static MAX_COLUMNS = 10;
	static MAX_ROWS = 10;
	static STORAGE_KEY = 'betaTodoBoardMatrix';
	static DEFAULT_CONFIG = {
		columns: 6,
		rows: 8
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
	 * @return {Array<Array<null>>} Empty 10x10 matrix
	 */
	initializeGrid() {
		return Array(TodoGridSrv.MAX_ROWS).fill(null).map(() =>
			Array(TodoGridSrv.MAX_COLUMNS).fill(null)
		);
	}
	
	/**
	 * Loads grid configuration and matrix from localStorage
	 * @return {{matrix: Array, config: Object}} Grid data or default structure
	 */
	loadGridFromStorage() {
		const stored = localStorage.getItem(TodoGridSrv.STORAGE_KEY);
		if (stored) {
			try {
				const data = JSON.parse(stored);
				if (data.matrix && data.config) {
					// Ensure loaded matrix is always maximum size
					const loadedMatrix = data.matrix;
					const matrix = Array(TodoGridSrv.MAX_ROWS).fill(null).map((_, row) => 
						Array(TodoGridSrv.MAX_COLUMNS).fill(null).map((_, col) => {
							// Copy existing data if it exists
							return (loadedMatrix[row] && loadedMatrix[row][col]) ? loadedMatrix[row][col] : null;
						})
					);
					
					return {
						matrix,
						config: {
							columns: data.config.columns,
							rows: data.config.rows
						}
					};
				}
			} catch (e) {
				console.warn('Failed to load grid from storage:', e);
			}
		}
		
		// Return default structure
		return {
			matrix: this.initializeGrid(),
			config: { ...TodoGridSrv.DEFAULT_CONFIG }
		};
	}
	
	/**
	 * Saves grid configuration and matrix to localStorage
	 * @param {Array} matrix - The grid matrix
	 * @param {Object} config - Grid configuration {columns, rows}
	 */
	saveGridToStorage(matrix, config) {
		const data = {
			matrix,
			config: {
				columns: config.columns,
				rows: config.rows
			}
		};
		localStorage.setItem(TodoGridSrv.STORAGE_KEY, JSON.stringify(data));
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
	 * Finds the position of a todo in the grid matrix
	 * @param {Array} matrix - The grid matrix
	 * @param {number} todoId - Todo ID to find
	 * @param {Object} config - Grid configuration {columns, rows}
	 * @return {{row: number|null, column: number|null}} Position or null values
	 */
	getTodoPosition(matrix, todoId, config) {
		if (!matrix || !todoId) return { row: null, column: null };
		
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
	 * Finds the next available slot in the grid matrix
	 * @param {Array} matrix - The grid matrix
	 * @param {Object} config - Grid configuration {columns, rows}
	 * @return {{row: number|null, column: number|null}} Next available position
	 */
	getNextAvailableSlot(matrix, config) {
		if (!matrix) return { column: null, row: null };

		for (let c = 0; c < config.columns; c++) {
			for (let r = 0; r < config.rows; r++) {
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
	 * @param {Array} matrix - The grid matrix
	 * @param {number} todoId - Todo ID being moved
	 * @param {number} targetRow - Target row position
	 * @param {number} targetColumn - Target column position
	 * @param {Object} config - Grid configuration {columns, rows}
	 * @return {Array} Updated matrix
	 */
	moveTodo(matrix, todoId, targetRow, targetColumn, config) {
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
			
			return newMatrix;
		}
		
		return matrix; // Return unchanged if todo not found
	}
	
	/**
	 * Places a todo in a specific position
	 * @param {Array} matrix - The grid matrix
	 * @param {number} todoId - Todo ID to place
	 * @param {number} row - Row position
	 * @param {number} column - Column position
	 * @return {Array} Updated matrix
	 */
	placeTodo(matrix, todoId, row, column) {
		const newMatrix = matrix.map(row => [...row]);
		newMatrix[row][column] = todoId;
		return newMatrix;
	}
	
	/**
	 * Removes a todo from the grid matrix
	 * @param {Array} matrix - The grid matrix
	 * @param {number} todoId - Todo ID to remove
	 * @param {Object} config - Grid configuration {columns, rows}
	 * @return {Array} Updated matrix
	 */
	removeTodo(matrix, todoId, config) {
		const position = this.getTodoPosition(matrix, todoId, config);
		if (position.row !== null && position.column !== null) {
			const newMatrix = matrix.map(row => [...row]);
			newMatrix[position.row][position.column] = null;
			return newMatrix;
		}
		return matrix; // Return unchanged if todo not found
	}
	
	// ============================================================================
	// GETTERS FOR CONSTANTS
	// ============================================================================
	
	get maxColumns() { return TodoGridSrv.MAX_COLUMNS; }
	get maxRows() { return TodoGridSrv.MAX_ROWS; }
	get defaultConfig() { return { ...TodoGridSrv.DEFAULT_CONFIG }; }
}

export const todoGridSrv = TodoGridSrv.getInstance();

