import { ref, computed, nextTick } from 'vue'
import { todoGridSrv } from '../services/TodoGridSrv.js'

export function useBoardManagement(store, multiboardData, currentBoardId, boardItems, matrixData, gridConfig) {
	// Refs for board modal
	const newBoardModal = ref(null)
	const boardNameInput = ref(null)
	const newBoardName = ref('')
	const isEditingBoard = ref(false)

	// Computed
	const currentBoard = computed(() =>
		boardItems.value.find(board => board.id === currentBoardId.value)
	)

	// Save grid data to storage
	function saveGridToStorage() {
		todoGridSrv.saveGridToStorage(multiboardData.value)
	}

	// Switch board
	function switchBoard() {
		// Save current state before switching
		saveGridToStorage()

		// Update grid config to match current board
		gridConfig.activeBoard = currentBoardId.value

		// Save updated config
		saveGridToStorage()
	}

	// Create new board
	function createNewBoard() {
		// Set create mode and reset form
		isEditingBoard.value = false
		newBoardName.value = ''
		newBoardModal.value.open()

		// Focus input after modal opens
		nextTick(() => {
			boardNameInput.value?.focus()
		})
	}

	// Update current board
	function updateCurrentBoard() {
		// Set edit mode and populate current board name
		isEditingBoard.value = true
		newBoardName.value = currentBoard.value?.name || ''
		newBoardModal.value.open()

		// Focus input after modal opens
		nextTick(() => {
			boardNameInput.value?.focus()
			boardNameInput.value?.select() // Select all text for easy editing
		})
	}

	// Cancel board action
	function cancelBoardAction() {
		newBoardName.value = ''
		isEditingBoard.value = false
		newBoardModal.value.close()
	}

	// Confirm board action (create or update)
	function confirmBoardAction() {
		if (!newBoardName.value.trim()) return

		if (isEditingBoard.value) {
			// Update existing board name
			const updatedData = todoGridSrv.renameBoard(currentBoardId.value, newBoardName.value.trim(), multiboardData.value)

			// Update local state
			boardItems.value = updatedData.boardItems

			saveGridToStorage()
		} else {
			// Create new board
			const updatedData = todoGridSrv.createBoard(newBoardName.value.trim(), multiboardData.value)

			// Update local state
			boardItems.value = updatedData.boardItems
			matrixData.value = updatedData.matrixData

			// Switch to the new board (it will be the last one created)
			const newBoard = updatedData.boardItems[updatedData.boardItems.length - 1]
			currentBoardId.value = newBoard.id

			// Update grid config to reflect the new active board
			gridConfig.activeBoard = newBoard.id

			saveGridToStorage()
		}

		// Close modal and reset
		newBoardName.value = ''
		isEditingBoard.value = false
		newBoardModal.value.close()
	}

	// Delete current board
	async function deleteCurrentBoard() {
		// Don't allow deleting if it's the last board
		if (boardItems.value.length <= 1) {
			alert('Cannot delete the last board')
			return
		}

		// Confirm deletion
		if (!confirm(`Are you sure you want to delete "${currentBoard.value?.name}"?`)) {
			return
		}

		// Delete all Tasks from this board before deleting the board
		const todoIdsToDelete = todoGridSrv.getTodoIdsFromBoard(currentBoardId.value, multiboardData.value)

		// Delete all todos from the store
		for (const todoId of todoIdsToDelete) {
			await store.dispatch('entity/deleteItem', {
				tableName: 'task',
				id: todoId
			})
		}

		// Delete board using service
		const updatedData = todoGridSrv.deleteBoard(currentBoardId.value, multiboardData.value)

		if (updatedData) {
			// Update local state
			boardItems.value = updatedData.boardItems
			matrixData.value = updatedData.matrixData
			gridConfig.columns = updatedData.config.columns
			gridConfig.rows = updatedData.config.rows
			gridConfig.activeBoard = updatedData.config.activeBoard

			// Switch to the new active board
			currentBoardId.value = updatedData.config.activeBoard

			saveGridToStorage()
		}
	}

	return {
		// Refs
		newBoardModal,
		boardNameInput,
		newBoardName,
		isEditingBoard,

		// Computed
		currentBoard,

		// Methods
		switchBoard,
		createNewBoard,
		updateCurrentBoard,
		cancelBoardAction,
		confirmBoardAction,
		deleteCurrentBoard
	}
}