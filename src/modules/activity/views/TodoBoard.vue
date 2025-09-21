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

			<pre>NEXT: {{ nextAvailableSlot.column  }}/{{ nextAvailableSlot.row  }} </pre>

			<BxButton
				label="RESET GRID"
				size="small"
				@click="initializeGrid"
			/>
			
			<BxButton
				type="soft"
				label="Grid Config"
				class="ml-auto"
				@click="openGridConfig"
			/>
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

		<!-- Grid Configuration Modal -->
		<GridConfig
			ref="gridConfigRef"
			@apply="applyGridConfig"
		/>

	</section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import BxIcon from '@/modules/ui/components/BxIcon.vue'
import BxButton from '@/modules/ui/components/BxButton.vue'
// import BxModal from '@/modules/ui/components/BxModal.vue'
import TodoSlot from '../components/todo/TodoSlot.vue'
import TodoCard from '../components/todo/TodoCard.vue'
import GridConfig from '../components/todo/GridConfig.vue'

// Store
const store = useStore()

// Refs
const gridConfigRef = ref(null)
const todoModalRef = ref(null)

// Constants for maximum grid size
const MAX_COLUMNS = 8
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

const pendingSlot = ref({ row: null, column: null })
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

function openGridConfig() {
	gridConfigRef.value?.open(gridConfig)
}

function applyGridConfig(newConfig) {
	// Just update the display configuration - matrix stays at maximum size
	gridConfig.columns = newConfig.columns
	gridConfig.rows = newConfig.rows
	
	saveGridToStorage()
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
		
		// // Place in pending slot if creation was successful
		// if (result.status === 'OK' && pendingSlot.value.row !== null && pendingSlot.value.column !== null) {
		// 	gridMatrix.value[pendingSlot.value.row][pendingSlot.value.column] = result.itemId
		// 	saveGridToStorage()
		// }

		// Place in next available slot if creation was successful
		if (result.status === 'OK' && nextAvailableSlot.value.row !== null && nextAvailableSlot.value.column !== null) {

			console.log("...placing todo", result.itemId, "in slot", nextAvailableSlot.value);

			const { column, row } = nextAvailableSlot.value;
			gridMatrix.value[row][column] = result.itemId;
			saveGridToStorage()
		}
	}
	
	todoModalRef.value?.close()
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

function cancelTodoForm() {
	todoModalRef.value?.close()
	resetTodoForm()
}

// Lifecycle
onMounted(async () => {
	loadGridFromStorage()
	await store.dispatch('entity/loadItems', 'task')
})
</script>

