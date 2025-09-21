<template>
	<section class="h-full grid grid-rows-[auto_auto_1fr]">
		<!-- Toolbar -->
		<div class="toolbar flex items-center gap-4 p-1">
			<router-link
				to="/"
				class="flex gap-1 items-center text-stone-400 hover:text-stone-300 text-sm"
			>
				<BxIcon icon="arrow_left" size="small"/>
				BACK
			</router-link>

			<!-- Board selector -->
			<div class="flex items-center gap-2">
				<select 
					v-model="currentBoardId"
					@change="switchBoard"
					class="w-56 bg-stone-800 text-white rounded p-1 text-xs border border-stone-600"
				>
					<option 
						v-for="board in boardItems" 
						:key="board.id" 
						:value="board.id"
					>
						{{ board.name }}
					</option>
				</select>
				<BxIconButton
					icon="add"
					size="small"
					@click="createNewBoard"
				/>
			</div>

			<div class="todo-form flex gap-1 items-center">
				<input
					v-model="todoForm.desc"
					placeholder="New task..."
					type="text"
					class="w-[50vw] bg-stone-800 rounded text-white p-1"
				/>
				<BxButton
					label="Add"
					size="small"
					:disabled="!todoForm.desc"
					@click="saveTodo"
				/>
			</div>

<!--			<pre>NEXT: {{ nextAvailableSlot.column  }}/{{ nextAvailableSlot.row  }} </pre>-->

<!--			<BxButton-->
<!--				label="RESET GRID"-->
<!--				size="small"-->
<!--				@click="initializeGrid"-->
<!--			/>-->
			
			<!-- Grid controls -->
			<div class="ml-auto flex items-center gap-2 bg-stone-800 rounded p-1">
				<!-- Columns control -->
				<div class="flex items-center gap-2">
					<span class="text-white text-sm">Columns</span>
					<BxButton
						type="soft"
						label="-"
						size="small"
						:disabled="gridConfig.columns <= 3"
						@click="adjustColumns(-1)"
					/>
					<span class="text-white text-sm w-6 text-center">{{ gridConfig.columns }}</span>
					<BxButton
						type="soft"
						label="+"
						size="small"
						:disabled="gridConfig.columns >= MAX_COLUMNS"
						@click="adjustColumns(1)"
					/>
				</div>
				
				<!-- Rows control -->
				<div class="flex items-center gap-2">
					<span class="text-white text-sm">Rows</span>
					<BxButton
						type="soft"
						label="-"
						size="small"
						:disabled="gridConfig.rows <= 5"
						@click="adjustRows(-1)"
					/>
					<span class="text-white text-sm w-6 text-center">{{ gridConfig.rows }}</span>
					<BxButton
						type="soft"
						label="+"
						size="small"
						:disabled="gridConfig.rows >= MAX_ROWS"
						@click="adjustRows(1)"
					/>
				</div>
			</div>
		</div>

		<!-- Board info -->
		<div class="flex items-center justify-between bg-stone-700 border-b border-stone-600 py-1">
			<h1 class="text-white font-bold">
				#{{ currentBoardId }} - {{ currentBoard?.name || 'Loading...' }}
			</h1>

			<BxIconButton
				icon="trash"
				type="danger"
				size="small"
				@click="deleteCurrentBoard"
			/>
		</div>

		<!-- Main grid area -->
		<div class="bg-stone-800 rounded p-4 overflow-hidden">
			<div
				class="grid gap-x-3 gapx-y-1 h-full"
				:style="gridStyle"
			>
				<template v-for="row in gridConfig.rows" :key="`row-${row}`">
					<TodoSlot
						v-for="col in gridConfig.columns"
						:key="`slot-${row-1}-${col-1}`"
						:row="row-1"
						:column="col-1"
						:todo-id="currentMatrix[row-1] && currentMatrix[row-1][col-1]"
						@drop="handleTodoDrop"
					>
						<TodoCard
							v-if="currentMatrix[row-1] && currentMatrix[row-1][col-1] && getTodoById(currentMatrix[row-1][col-1])"
							:todo="getTodoById(currentMatrix[row-1][col-1])"
							:position="{ row: row-1, column: col-1 }"
							@update="handleTodoUpdate"
							@delete="handleTodoDelete"
						/>
					</TodoSlot>
				</template>
			</div>
		</div>


		<!-- New Board Modal -->
		<BxModal ref="newBoardModal">
			<template #header>
				<h2 class="text-white text-lg font-bold">Create New Board</h2>
			</template>
			
			<template #body>
				<div class="space-y-4">
					<div>
						<label class="block text-white text-sm font-medium mb-2">Board Name</label>
						<input
							v-model="newBoardName"
							type="text"
							placeholder="Enter board name..."
							class="w-full bg-stone-800 text-white rounded p-2 border border-stone-600 focus:border-stone-400 outline-none"
							@keyup.enter="confirmCreateBoard"
							ref="boardNameInput"
						/>
					</div>
				</div>
			</template>
			
			<template #footer>
				<div class="flex gap-2 justify-end">
					<BxButton
						label="Cancel"
						type="soft"
						@click="cancelCreateBoard"
					/>
					<BxButton
						label="Create"
						:disabled="!newBoardName.trim()"
						@click="confirmCreateBoard"
					/>
				</div>
			</template>
		</BxModal>

	</section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { todoGridSrv } from '../services/TodoGridSrv.js'


import TodoSlot from '../components/todo/TodoSlot.vue'
import TodoCard from '../components/todo/TodoCard.vue'

// Store
const store = useStore()

// Refs
const newBoardModal = ref(null)
const boardNameInput = ref(null)
const newBoardName = ref('')

// Constants from service
const MAX_COLUMNS = todoGridSrv.maxColumns
const MAX_ROWS = todoGridSrv.maxRows

// Reactive data
const gridConfig = reactive({
	columns: 6,
	rows: 8,
	activeBoard: 1
})

const boardItems = ref([])
const matrixData = ref({})
const currentBoardId = ref(1)
const todoForm = reactive({
	id: null,
	desc: '',
	color: '$D',
	starred: false,
	done: false
})

// Computed values
const currentMatrix = computed(() => matrixData.value[currentBoardId.value] || [])
const multiboardData = computed(() => ({
	config: gridConfig,
	boardItems: boardItems.value,
	matrixData: matrixData.value
}))

const nextAvailableSlot = computed(() => 
	todoGridSrv.getNextAvailableSlot(currentBoardId.value, multiboardData.value)
)

const currentBoard = computed(() => 
	boardItems.value.find(board => board.id === currentBoardId.value)
)

// Computed
const gridStyle = computed(() => ({
	gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
	gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
}))

const isEditingTodo = computed(() => todoForm.id !== null)

const tasks = computed(() => store.getters['entity/getItemsFromTable']('task'))

// ============================================================================
// GRID INITIALIZATION & PERSISTENCE
// ============================================================================

function loadGridFromStorage() {
	const data = todoGridSrv.loadGridFromStorage()
	gridConfig.columns = data.config.columns
	gridConfig.rows = data.config.rows
	gridConfig.activeBoard = data.config.activeBoard
	boardItems.value = data.boardItems
	matrixData.value = data.matrixData
	currentBoardId.value = data.config.activeBoard
}

function saveGridToStorage() {
	todoGridSrv.saveGridToStorage(multiboardData.value)
}

// ============================================================================
// GRID CONFIGURATION CONTROLS
// ============================================================================

function adjustColumns(delta) {
	const newColumns = todoGridSrv.adjustColumns(gridConfig.columns, delta)
	if (newColumns !== null) {
		gridConfig.columns = newColumns
		saveGridToStorage()
	}
}

function adjustRows(delta) {
	const newRows = todoGridSrv.adjustRows(gridConfig.rows, delta)
	if (newRows !== null) {
		gridConfig.rows = newRows
		saveGridToStorage()
	}
}

// ============================================================================
// TODO DATA ACCESS & POSITION UTILITIES
// ============================================================================

function getTodoById(id) {
	return tasks.value.find(task => task.id === id)
}

function getTodoPosition(todoId) {
	return todoGridSrv.getTodoPosition(todoId, currentBoardId.value, multiboardData.value)
}

// ============================================================================
// DRAG & DROP OPERATIONS
// ============================================================================

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

// ============================================================================
// TODO CRUD OPERATIONS
// ============================================================================

async function handleTodoUpdate(updatedTodo) {
	await store.dispatch('entity/updateItem', {
		tableName: 'task',
		item: updatedTodo
	})
}

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

function resetTodoForm() {
	todoForm.id = null
	todoForm.desc = ''
	todoForm.color = '$D'
	todoForm.starred = false
	todoForm.done = false
}

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

// ============================================================================
// BOARD SWITCHING & MANAGEMENT
// ============================================================================

function switchBoard() {
	// Save current state before switching
	saveGridToStorage()
	
	// Update grid config to match current board
	gridConfig.activeBoard = currentBoardId.value
	
	// Save updated config
	saveGridToStorage()
}

function createNewBoard() {
	// Reset and open modal
	newBoardName.value = ''
	newBoardModal.value.open()
	
	// Focus input after modal opens
	setTimeout(() => {
		boardNameInput.value?.focus()
	}, 100)
}

function cancelCreateBoard() {
	newBoardName.value = ''
	newBoardModal.value.close()
}

function confirmCreateBoard() {
	if (!newBoardName.value.trim()) return
	
	// Create new board using service
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
	
	// Close modal and reset
	newBoardName.value = ''
	newBoardModal.value.close()
}

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


// Lifecycle
onMounted(async () => {
	loadGridFromStorage()
	await store.dispatch('entity/loadItems', 'task')
})
</script>

