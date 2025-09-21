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
import { todoGridSrv } from '../services/TodoGridSrv.js'


import BxIcon from '@/modules/ui/components/BxIcon.vue'
import BxButton from '@/modules/ui/components/BxButton.vue'
import TodoSlot from '../components/todo/TodoSlot.vue'
import TodoCard from '../components/todo/TodoCard.vue'

// Store
const store = useStore()

// Refs
// (no refs needed currently)

// Constants from service
const MAX_COLUMNS = todoGridSrv.maxColumns
const MAX_ROWS = todoGridSrv.maxRows

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

const nextAvailableSlot = computed(() => 
	todoGridSrv.getNextAvailableSlot(gridMatrix.value, gridConfig)
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
	gridMatrix.value = data.matrix
	gridConfig.columns = data.config.columns
	gridConfig.rows = data.config.rows
}

function saveGridToStorage() {
	todoGridSrv.saveGridToStorage(gridMatrix.value, gridConfig)
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
	return todoGridSrv.getTodoPosition(gridMatrix.value, todoId, gridConfig)
}

// ============================================================================
// DRAG & DROP OPERATIONS
// ============================================================================

function handleTodoDrop({ todoId, targetRow, targetColumn }) {
	gridMatrix.value = todoGridSrv.moveTodo(
		gridMatrix.value, 
		todoId, 
		targetRow, 
		targetColumn, 
		gridConfig
	)
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
	gridMatrix.value = todoGridSrv.removeTodo(gridMatrix.value, todoId, gridConfig)
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
			gridMatrix.value = todoGridSrv.placeTodo(gridMatrix.value, result.itemId, row, column)
			saveGridToStorage()
		}
	}
	
	resetTodoForm()
}


// Lifecycle
onMounted(async () => {
	loadGridFromStorage()
	await store.dispatch('entity/loadItems', 'task')
})
</script>

