import { reactive, computed } from 'vue'
import { todoGridSrv } from '../services/TodoGridSrv.js'

export function useGridConfig(boardItems, matrixData) {
	// Constants from service
	const MAX_COLUMNS = todoGridSrv.maxColumns
	const MAX_ROWS = todoGridSrv.maxRows

	// Reactive grid configuration
	const gridConfig = reactive({
		columns: 6,
		rows: 8,
		activeBoard: 1
	})

	// Computed values
	const multiboardData = computed(() => ({
		config: gridConfig,
		boardItems: boardItems.value,
		matrixData: matrixData.value
	}))

	const gridStyle = computed(() => ({
		gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
		gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
	}))

	// Load grid data from storage
	function loadGridFromStorage() {
		const data = todoGridSrv.loadGridFromStorage()
		gridConfig.columns = data.config.columns
		gridConfig.rows = data.config.rows
		gridConfig.activeBoard = data.config.activeBoard
		boardItems.value = data.boardItems
		matrixData.value = data.matrixData
		return data.config.activeBoard
	}

	// Save grid data to storage
	function saveGridToStorage() {
		todoGridSrv.saveGridToStorage(multiboardData.value)
	}

	// Adjust columns
	function adjustColumns(delta) {
		const newColumns = todoGridSrv.adjustColumns(gridConfig.columns, delta)
		if (newColumns !== null) {
			gridConfig.columns = newColumns
			saveGridToStorage()
		}
	}

	// Adjust rows
	function adjustRows(delta) {
		const newRows = todoGridSrv.adjustRows(gridConfig.rows, delta)
		if (newRows !== null) {
			gridConfig.rows = newRows
			saveGridToStorage()
		}
	}

	return {
		// Constants
		MAX_COLUMNS,
		MAX_ROWS,

		// Reactive state
		gridConfig,

		// Computed
		multiboardData,
		gridStyle,

		// Methods
		loadGridFromStorage,
		saveGridToStorage,
		adjustColumns,
		adjustRows
	}
}