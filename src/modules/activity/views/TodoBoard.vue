<template>
	<section class="h-full grid grid-rows-[auto_1fr]">
		<!-- Toolbar -->
		<div class="toolbar flex items-center gap-4 p-1">
			<router-link
				to="/"
				class="flex gap-1 items-center text-stone-400 hover:text-stone-300 text-sm"
			>
				<BxIcon icon="arrow_left" size="small"/>
				BACK
			</router-link>

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

		<!-- Main grid area -->
		<div class="bg-stone-800 p-4 overflow-hidden">
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
						:todo-id="gridMatrix[row-1] && gridMatrix[row-1][col-1]"
						@drop="handleTodoDrop"
					>
						<TodoCard
							v-if="gridMatrix[row-1] && gridMatrix[row-1][col-1] && getTodoById(gridMatrix[row-1][col-1])"
							:todo="getTodoById(gridMatrix[row-1][col-1])"
							:position="{ row: row-1, column: col-1 }"
							@update="handleTodoUpdate"
							@delete="handleTodoDelete"
						/>
					</TodoSlot>
				</template>
			</div>
		</div>


	</section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import BxIcon from '@/modules/ui/components/BxIcon.vue'
import BxButton from '@/modules/ui/components/BxButton.vue'
import TodoSlot from '../components/todo/TodoSlot.vue'
import TodoCard from '../components/todo/TodoCard.vue'

// Store
const store = useStore()

// Refs
// (no refs needed currently)

// Constants for maximum grid size
const MAX_COLUMNS = 10
const MAX_ROWS = 10

// Reactive data
const gridConfig = reactive({
	columns: 6,
	rows: 8
})

const gridMatrix = ref([])
const todoForm = reactive({
	id: null,
	desc: '',
	color: '$D',
	starred: false,
	done: false
})

const nextAvailableSlot = computed(() => getNextAvailableSlot())

// Computed
const gridStyle = computed(() => ({
	gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
	gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
}))

const isEditingTodo = computed(() => todoForm.id !== null)

const tasks = computed(() => store.getters['entity/getItemsFromTable']('task'))

const loading = computed(() => store.state.entity.loading)

// const colorOptions = [
// 	{ code: '$D', name: 'Default', bgClass: 'bg-yellow-600' },
// 	{ code: '$A', name: 'Category A', bgClass: 'bg-blue-600' },
// 	{ code: '$B', name: 'Category B', bgClass: 'bg-purple-600' },
// 	{ code: '$C', name: 'Category C', bgClass: 'bg-green-600' },
// 	{ code: '$E', name: 'Category E', bgClass: 'bg-red-600' }
// ]

// Methods
function initializeGrid() {
	// Always initialize to maximum size to prevent data loss
	gridMatrix.value = Array(MAX_ROWS).fill(null).map(() =>
		Array(MAX_COLUMNS).fill(null)
	)
}

function loadGridFromStorage() {
	const stored = localStorage.getItem('betaTodoBoardMatrix')
	if (stored) {
		try {
			const data = JSON.parse(stored)
			if (data.matrix && data.config) {
				gridConfig.columns = data.config.columns
				gridConfig.rows = data.config.rows
				
				// Ensure loaded matrix is always maximum size
				const loadedMatrix = data.matrix
				gridMatrix.value = Array(MAX_ROWS).fill(null).map((_, row) => 
					Array(MAX_COLUMNS).fill(null).map((_, col) => {
						// Copy existing data if it exists
						return (loadedMatrix[row] && loadedMatrix[row][col]) ? loadedMatrix[row][col] : null
					})
				)
				return
			}
		} catch (e) {
			console.warn('Failed to load grid from storage:', e)
		}
	}
	initializeGrid()
}

function saveGridToStorage() {
	const data = {
		matrix: gridMatrix.value,
		config: {
			columns: gridConfig.columns,
			rows: gridConfig.rows
		}
	}
	localStorage.setItem('betaTodoBoardMatrix', JSON.stringify(data))
}

function getTodoById(id) {
	return tasks.value.find(task => task.id === id)
}

function getTodoPosition(todoId) {
	if (!gridMatrix.value || !todoId) return { row: null, column: null }
	
	for (let r = 0; r < gridConfig.rows; r++) {
		for (let c = 0; c < gridConfig.columns; c++) {
			if (gridMatrix.value[r] && gridMatrix.value[r][c] === todoId) {
				return { row: r, column: c }
			}
		}
	}
	
	return { row: null, column: null }
}


function adjustColumns(delta) {
	const newColumns = gridConfig.columns + delta
	if (newColumns >= 3 && newColumns <= MAX_COLUMNS) {
		gridConfig.columns = newColumns
		saveGridToStorage()
	}
}

function adjustRows(delta) {
	const newRows = gridConfig.rows + delta
	if (newRows >= 5 && newRows <= MAX_ROWS) {
		gridConfig.rows = newRows
		saveGridToStorage()
	}
}

function handleTodoDrop({ todoId, targetRow, targetColumn }) {
	// Find current position of the todo
	let currentRow = -1, currentColumn = -1
	
	for (let r = 0; r < gridConfig.rows; r++) {
		for (let c = 0; c < gridConfig.columns; c++) {
			if (gridMatrix.value[r][c] === todoId) {
				currentRow = r
				currentColumn = c
				break
			}
		}
		if (currentRow !== -1) break
	}
	
	if (currentRow !== -1 && currentColumn !== -1) {
		// Swap positions
		const targetTodoId = gridMatrix.value[targetRow][targetColumn]
		gridMatrix.value[currentRow][currentColumn] = targetTodoId
		gridMatrix.value[targetRow][targetColumn] = todoId
		
		saveGridToStorage()
	}
}

async function handleTodoUpdate(updatedTodo) {
	await store.dispatch('entity/updateItem', {
		tableName: 'task',
		item: updatedTodo
	})
}

async function handleTodoDelete(todoId) {
	const { row, column } = getTodoPosition(todoId);
	gridMatrix.value[row][column] = null;
	saveGridToStorage();

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

			console.log("...placing todo", result.itemId, "in slot", nextAvailableSlot.value);

			const { column, row } = nextAvailableSlot.value;
			gridMatrix.value[row][column] = result.itemId;
			saveGridToStorage()
		}
	}
	
	resetTodoForm()
}

/**
 * Returns the first available slot in the grid matrix
 * to be used for new todos
 * @return {{column: null, row: null}|{column: number, row: number}}
 */
function getNextAvailableSlot() {
	if (!gridMatrix.value) return { column: null, row: null }

	for (let c = 0; c < gridConfig.columns; c++) {
		for (let r = 0; r < gridConfig.rows; r++) {
			if (!gridMatrix.value[r]) continue;
			if (!gridMatrix.value[r][c]) {
				return { row: r, column: c }
			}
		}
	}

	return { column: null, row: null }
}


// Lifecycle
onMounted(async () => {
	loadGridFromStorage()
	await store.dispatch('entity/loadItems', 'task')
})
</script>

