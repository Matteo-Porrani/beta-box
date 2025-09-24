import { reactive, computed } from 'vue'
import { todoGridSrv } from '../services/TodoGridSrv.js'

export function useTodoOperations(store, tasks, multiboardData, currentBoardId, matrixData) {
	// Todo form reactive state
	const todoForm = reactive({
		id: null,
		desc: '',
		color: '$D',
		starred: false,
		done: false
	})

	// Computed values
	const isEditingTodo = computed(() => todoForm.id !== null)

	const nextAvailableSlot = computed(() =>
		todoGridSrv.getNextAvailableSlot(currentBoardId.value, multiboardData.value)
	)

	// Save grid data to storage
	function saveGridToStorage() {
		todoGridSrv.saveGridToStorage(multiboardData.value)
	}

	// Get todo by ID
	function getTodoById(id) {
		return tasks.value.find(task => task.id === id)
	}

	// Get todo position in grid
	function getTodoPosition(todoId) {
		return todoGridSrv.getTodoPosition(todoId, currentBoardId.value, multiboardData.value)
	}

	// Handle drag and drop
	function handleTodoDrop({ todoId, targetRow, targetColumn }) {
		const updatedData = todoGridSrv.moveTodo(
			todoId,
			targetRow,
			targetColumn,
			currentBoardId.value,
			multiboardData.value
		)

		// Update local state
		matrixData.value = updatedData.matrixData
		saveGridToStorage()
	}

	// Update todo
	async function handleTodoUpdate(updatedTodo) {
		await store.dispatch('entity/updateItem', {
			tableName: 'task',
			item: updatedTodo
		})
	}

	// Delete todo
	async function handleTodoDelete(todoId) {
		const updatedData = todoGridSrv.removeTodo(todoId, currentBoardId.value, multiboardData.value)

		// Update local state
		matrixData.value = updatedData.matrixData
		saveGridToStorage()

		await store.dispatch('entity/deleteItem', {
			tableName: 'task',
			id: todoId
		})
	}

	// Copy todo
	async function handleTodoCopy(todoId) {
		const sourceTodo = getTodoById(todoId)
		if (!sourceTodo) return

		// Clone todo object (without ID)
		const newTodo = {
			desc: sourceTodo.desc,
			color: sourceTodo.color,
			starred: sourceTodo.starred,
			done: sourceTodo.done
		}

		// Create new todo in store (auto-generates ID)
		const result = await store.dispatch('entity/addItem', {
			tableName: 'task',
			item: newTodo
		})

		if (result.status === 'OK') {
			// Find source position
			const sourcePosition = getTodoPosition(todoId)

			// Find next available slot starting from source position
			const nextSlot = todoGridSrv.getNextAvailableSlot(
				currentBoardId.value,
				multiboardData.value,
				sourcePosition.column,
				sourcePosition.row
			)

			// Place duplicate in next available slot
			if (nextSlot.row !== null && nextSlot.column !== null) {
				const updatedData = todoGridSrv.placeTodo(
					result.itemId,
					nextSlot.row,
					nextSlot.column,
					currentBoardId.value,
					multiboardData.value
				)

				// Update local state
				matrixData.value = updatedData.matrixData
				saveGridToStorage()
			}
		}
	}

	// Reset todo form
	function resetTodoForm() {
		todoForm.id = null
		todoForm.desc = ''
		todoForm.color = '$D'
		todoForm.starred = false
		todoForm.done = false
	}

	// Save todo (create or update)
	async function saveTodo() {
		if (!todoForm.desc.trim()) return

		if (isEditingTodo.value) {
			// Update existing task
			await handleTodoUpdate({ ...todoForm })
		} else {
			// Create new task
			const newTodo = {
				desc: todoForm.desc,
				color: "$D",
				starred: false,
				done: false
			}

			const result = await store.dispatch('entity/addItem', {
				tableName: 'task',
				item: newTodo
			})

			// Place in next available slot if creation was successful
			if (result.status === 'OK' && nextAvailableSlot.value.row !== null && nextAvailableSlot.value.column !== null) {
				const { column, row } = nextAvailableSlot.value;
				const updatedData = todoGridSrv.placeTodo(result.itemId, row, column, currentBoardId.value, multiboardData.value)

				// Update local state
				matrixData.value = updatedData.matrixData
				saveGridToStorage()
			}
		}

		resetTodoForm()
	}

	return {
		// Reactive state
		todoForm,

		// Computed
		isEditingTodo,
		nextAvailableSlot,

		// Methods
		getTodoById,
		getTodoPosition,
		handleTodoDrop,
		handleTodoUpdate,
		handleTodoDelete,
		handleTodoCopy,
		resetTodoForm,
		saveTodo
	}
}