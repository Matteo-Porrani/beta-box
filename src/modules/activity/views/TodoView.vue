<template>
	<DefaultLayout>
		<section class="h-full grid grid-rows-[auto_1fr]">
			<!-- Toolbar -->
			<div class="toolbar flex items-center gap-6 bg-stone-700 rounded p-1">
				<!-- Board selector -->
			<div class="flex items-center gap-2">
				<BxHoverSelect
					v-model="currentBoardId"
					:options="boardItems"
					@change="switchBoard"
				/>
				<BxIconButton
					icon="add"
					size="small"
					@click="createNewBoard"
				/>
				<BxIconButton
					icon="edit"
					size="small"
					type="secondary"
					@click="updateCurrentBoard"
				/>
				<BxIconButton
					icon="trash"
					type="secondary"
					size="small"
					class="ml-auto"
					@click="deleteCurrentBoard"
				/>
			</div>

			<div class="todo-form flex gap-1 items-center">
				<input
					v-model="todoForm.desc"
					placeholder="New task..."
					type="text"
					class="w-96 bg-stone-800 rounded text-white p-1"
				/>
				<BxButton
					label="Insert"
					size="small"
					:disabled="!todoForm.desc"
					@click="saveTodo"
				/>
			</div>

			<div class="flex items-center gap-2">
				<p class="text-xs">A</p>
				<input
					type="range"
					min="1"
					max="2"
					class="w-16 accent-sky-500"
					v-model.number="textSize"
				>
				<p class="text-lg">A</p>
			</div>

			<!-- Grid controls -->
			<div class="ml-auto flex items-center gap-8 bg-stone-800 rounded p-1">
				<!-- Columns control -->
				<div class="flex items-center gap-2">
					<BxIconButton
						icon="caret_left"
						type="soft"
						size="small"
						:disabled="gridConfig.columns <= 3"
						@click="adjustColumns(-1)"
					/>
					<span class="text-white text-sm w-8 text-center">{{ gridConfig.columns }} C</span>
					<BxIconButton
						icon="caret_right"
						type="soft"
						size="small"
						:disabled="gridConfig.columns >= MAX_COLUMNS"
						@click="adjustColumns(1)"
					/>
				</div>
				
				<!-- Rows control -->
				<div class="flex items-center gap-2">
					<BxIconButton
						icon="caret_left"
						type="soft"
						size="small"
						:disabled="gridConfig.rows <= 5"
						@click="adjustRows(-1)"
					/>
					<span class="text-white text-sm w-8 text-center">{{ gridConfig.rows }} R</span>
					<BxIconButton
						icon="caret_right"
						type="soft"
						size="small"
						:disabled="gridConfig.rows >= MAX_ROWS"
						@click="adjustRows(1)"
					/>
				</div>
			</div>
		</div>

		<!-- Main grid area -->
		<div class="bg-stone-800 rounded overflow-hidden p-1">
			<!-- Column Headers -->
			<div
				class="grid gap-x-4 mb-2"
				:style="{ gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)` }"
			>
				<div
					v-for="col in gridConfig.columns"
					:key="`header-${col-1}`"
					class="relative rounded text-center text-xs font-medium cursor-pointer transition-colors hover:bg-stone-700 py-0.5"
					:class="{
            'bg-sky-600 hover:bg-sky-500 text-white': selectedColumn === col-1,
            'text-stone-400': selectedColumn !== col-1,
          }"
					@click="toggleColumnSelection(col-1)"
				>
					<!-- Left arrow button -->
					<BxIconButton
						v-if="selectedColumn === col-1 && selectedColumn !== 0"
            no-min-width
						icon="caret_left"
						size="small"
						type="primary"
						class="absolute -left-7 top-1/2 -translate-y-1/2 w-6 z-50"
						@click.stop="moveColumn(-1)"
					/>

					{{ col }}

					<!-- Right arrow button -->
					<BxIconButton
						v-if="selectedColumn === col-1 && selectedColumn !== gridConfig.columns - 1"
            no-min-width
						icon="caret_right"
						size="small"
						type="primary"
						class="absolute -right-7 top-1/2 -translate-y-1/2 w-6 z-50"
						@click.stop="moveColumn(1)"
					/>
				</div>
			</div>

			<!-- Grid -->
			<div
				class="grid gap-x-4 gap-y-0.5 h-full"
				:style="gridStyle"
			>
				<template v-for="row in gridConfig.rows" :key="`row-${row}`">
					<TodoSlot
						v-for="col in gridConfig.columns"
						:key="`slot-${row-1}-${col-1}`"
						:row="row-1"
						:column="col-1"
						:todo-id="currentMatrix[row-1] && currentMatrix[row-1][col-1]"
						:selected="selectedColumn === col-1"
						@drop="handleTodoDrop"
					>
						<TodoCard
							v-if="currentMatrix[row-1] && currentMatrix[row-1][col-1] && getTodoById(currentMatrix[row-1][col-1])"
							:todo="getTodoById(currentMatrix[row-1][col-1])"
							:position="{ row: row-1, column: col-1 }"
							:text-size="textSize"
							@update="handleTodoUpdate"
							@delete="handleTodoDelete"
							@copy="handleTodoCopy"
						/>
					</TodoSlot>
				</template>
			</div>
		</div>

		<!-- Floating Action Container -->
		<Transition name="fade">
			<div
				v-if="selectedColumn !== null"
				class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-stone-800 rounded-lg shadow-xl border border-stone-600 p-3 flex gap-3"
			>
				<BxButton
					label="Delete all cards"
					type="danger"
					size="small"
					@click="deleteAllColumnCards(selectedColumn)"
				/>
				<BxButton
					label="Toggle done"
					type="success"
					size="small"
					@click="toggleAllColumnCardsDone(selectedColumn)"
				/>
			</div>
		</Transition>

		</section>
	</DefaultLayout>

	<!-- Board Modal (Create/Edit) -->
	<BxModal ref="newBoardModal">
		<template #header>
			<h2 class="text-white text-lg font-bold">
				{{ isEditingBoard ? 'Edit Board Name' : 'Create New Board' }}
			</h2>
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
						@keyup.enter="confirmBoardAction"
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
					@click="cancelBoardAction"
				/>
				<BxButton
					:label="isEditingBoard ? 'Update' : 'Create'"
					:disabled="!newBoardName.trim()"
					@click="confirmBoardAction"
				/>
			</div>
		</template>
	</BxModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useBoardManagement } from '../composables/useBoardManagement.js'
import { useTodoOperations } from '../composables/useTodoOperations.js'
import { useGridConfig } from '../composables/useGridConfig.js'

import DefaultLayout from '@/modules/core/components/layout/DefaultLayout.vue'
import TodoSlot from '../components/todo/TodoSlot.vue'
import TodoCard from '../components/todo/TodoCard.vue'

// Store
const store = useStore()

// Reactive data
const boardItems = ref([])
const matrixData = ref({})
const currentBoardId = ref(1)
const textSize = ref(1) // default value is small
const selectedColumn = ref(null) // Track selected column (null = none selected)

// Grid configuration composable
const {
	MAX_COLUMNS,
	MAX_ROWS,
	gridConfig,
	multiboardData,
	gridStyle,
	loadGridFromStorage,
	saveGridToStorage,
	adjustColumns,
	adjustRows
} = useGridConfig(boardItems, matrixData)

// Board management composable
const {
	newBoardModal,
	boardNameInput,
	newBoardName,
	isEditingBoard,
	switchBoard,
	createNewBoard,
	updateCurrentBoard,
	cancelBoardAction,
	confirmBoardAction,
	deleteCurrentBoard
} = useBoardManagement(store, multiboardData, currentBoardId, boardItems, matrixData, gridConfig)

// Tasks from store
const tasks = computed(() => store.getters['entity/getItemsFromTable']('task'))

// Todo operations composable
const {
	todoForm,
	getTodoById,
	handleTodoDrop,
	handleTodoUpdate,
	handleTodoDelete,
	handleTodoCopy,
	saveTodo
} = useTodoOperations(store, tasks, multiboardData, currentBoardId, matrixData)

// Computed values
const currentMatrix = computed(() => matrixData.value[currentBoardId.value] || [])

// Column selection
function toggleColumnSelection(columnIndex) {
	// Toggle: if clicking the same column, deselect it
	if (selectedColumn.value === columnIndex) {
		selectedColumn.value = null
	} else {
		selectedColumn.value = columnIndex
	}
}

// Move column left (-1) or right (1)
function moveColumn(direction) {
	if (selectedColumn.value === null) return

	const sourceCol = selectedColumn.value
	const targetCol = sourceCol + direction

	// Validate target column is within bounds
	if (targetCol < 0 || targetCol >= gridConfig.columns) return

	// Get current matrix
	const matrix = matrixData.value[currentBoardId.value] || []

	// Swap columns in each row
	for (let row = 0; row < matrix.length; row++) {
		if (!matrix[row]) continue

		// Swap the todoId values between source and target columns
		const temp = matrix[row][sourceCol]
		matrix[row][sourceCol] = matrix[row][targetCol]
		matrix[row][targetCol] = temp
	}

	// Update the matrix data to trigger reactivity
	matrixData.value = { ...matrixData.value }

	// Save to storage
	saveGridToStorage()

	// Update selection to follow the moved column
	selectedColumn.value = targetCol
}

// Bulk operations
function deleteAllColumnCards(columnIndex) {
	if (columnIndex === null) return

	const matrix = matrixData.value[currentBoardId.value] || []
	const todoIdsToDelete = []

	// Collect all todoIds from the specified column
	for (let row = 0; row < matrix.length; row++) {
		if (matrix[row] && matrix[row][columnIndex]) {
			todoIdsToDelete.push(matrix[row][columnIndex])
			// Clear the slot in the matrix
			matrix[row][columnIndex] = null
		}
	}

	// Delete each todo from the store
	todoIdsToDelete.forEach(todoId => {
		store.dispatch("entity/deleteItem", { table: "task", id: todoId })
	})

	// Update matrix data and save
	matrixData.value = { ...matrixData.value }
	saveGridToStorage()

	// Deselect the column
	selectedColumn.value = null
}

function toggleAllColumnCardsDone(columnIndex) {
	if (columnIndex === null) return

	const matrix = matrixData.value[currentBoardId.value] || []
	const todoIdsToUpdate = []

	// Collect all todoIds from the specified column
	for (let row = 0; row < matrix.length; row++) {
		if (matrix[row] && matrix[row][columnIndex]) {
			todoIdsToUpdate.push(matrix[row][columnIndex])
		}
	}

	// Toggle done state for each todo
	todoIdsToUpdate.forEach(todoId => {
		const todo = getTodoById(todoId)
		if (todo) {
			store.dispatch("entity/updateItem", {
				tableName: "task",
				item: { ...todo, done: !todo.done }
			})
		}
	})
}

function moveColumnCards(fromColumn, toColumn) {
	// TODO: Implement bulk move for all cards from one column to another
	console.log(`Move all cards from column ${fromColumn} to column ${toColumn}`)
}

function copyColumnCards(columnIndex) {
	// TODO: Implement bulk copy for all cards in the specified column
	console.log(`Copy all cards in column ${columnIndex}`)
}



// Lifecycle
onMounted(async () => {
	currentBoardId.value = loadGridFromStorage()
	await store.dispatch('entity/loadItems', 'task')
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
