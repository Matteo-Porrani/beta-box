<template>
	<section class="h-full grid grid-rows-[auto_1fr]">
		<!-- Toolbar -->
		<div class="toolbar px-1 flex justify-between items-center">
			<router-link
				to="/"
				class="flex gap-1 items-center text-stone-400 hover:text-stone-300 text-sm"
			>
				<BxIcon icon="arrow_left" size="small"/>
				BACK
			</router-link>
			
			<BxButton
				type="soft"
				label="Grid Config"
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
						@click="handleSlotClick"
					>
						<TodoCard
							v-if="gridMatrix[row-1] && gridMatrix[row-1][col-1] && getTodoById(gridMatrix[row-1][col-1])"
							:todo="getTodoById(gridMatrix[row-1][col-1])"
							@update="handleTodoUpdate"
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

		<!-- Todo Form Modal -->
		<BxModal ref="todoModalRef">
			<template #header>
				<h2 class="font-bold text-3xl text-white">{{ isEditingTodo ? 'Edit' : 'New' }} Todo</h2>
			</template>

			<template #body>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-stone-300 mb-2">
							Description
						</label>
						<textarea
							v-model="todoForm.desc"
							class="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
							rows="3"
							placeholder="Enter todo description..."
						/>
					</div>
					
					<div class="flex items-center gap-4">
						<label class="flex items-center gap-2">
							<input
								v-model="todoForm.starred"
								type="checkbox"
								class="w-4 h-4"
							/>
							<span class="text-stone-300">Title Task</span>
						</label>
						
						<div class="flex gap-2">
							<button
								v-for="color in colorOptions"
								:key="color.code"
								class="w-8 h-8 rounded border transition-all duration-150"
								:class="[
									color.bgClass,
									{
										'border-white border-2': todoForm.color === color.code,
										'border-stone-500': todoForm.color !== color.code
									}
								]"
								@click="todoForm.color = color.code"
							/>
						</div>
					</div>
				</div>
			</template>

			<template #footer>
				<div class="w-full flex justify-between">
					<BxButton
						type="soft"
						label="Cancel"
						@click="cancelTodoForm"
					/>
					<BxButton
						label="Save"
						@click="saveTodo"
					/>
				</div>
			</template>
		</BxModal>
	</section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import BxIcon from '@/modules/ui/components/BxIcon.vue'
import BxButton from '@/modules/ui/components/BxButton.vue'
import BxModal from '@/modules/ui/components/BxModal.vue'
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

// Computed
const gridStyle = computed(() => ({
	gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
	gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
}))

const isEditingTodo = computed(() => todoForm.id !== null)

const tasks = computed(() => store.getters['entity/getItemsFromTable']('task'))

const loading = computed(() => store.state.entity.loading)

const colorOptions = [
	{ code: '$D', name: 'Default', bgClass: 'bg-yellow-600' },
	{ code: '$A', name: 'Category A', bgClass: 'bg-blue-600' },
	{ code: '$B', name: 'Category B', bgClass: 'bg-purple-600' },
	{ code: '$C', name: 'Category C', bgClass: 'bg-green-600' },
	{ code: '$E', name: 'Category E', bgClass: 'bg-red-600' }
]

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

function openGridConfig() {
	gridConfigRef.value?.open(gridConfig)
}

function applyGridConfig(newConfig) {
	// Just update the display configuration - matrix stays at maximum size
	gridConfig.columns = newConfig.columns
	gridConfig.rows = newConfig.rows
	
	saveGridToStorage()
}

function handleSlotClick({ row, column }) {
	pendingSlot.value = { row, column }
	resetTodoForm()
	todoModalRef.value?.open()
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
		// Update existing todo
		await handleTodoUpdate({ ...todoForm })
	} else {
		// Create new todo
		const newTodo = {
			desc: todoForm.desc,
			color: todoForm.color,
			starred: todoForm.starred,
			done: todoForm.done
		}
		
		const result = await store.dispatch('entity/addItem', {
			tableName: 'task',
			item: newTodo
		})
		
		// Place in pending slot if creation was successful
		if (result.status === 'OK' && pendingSlot.value.row !== null && pendingSlot.value.column !== null) {
			gridMatrix.value[pendingSlot.value.row][pendingSlot.value.column] = result.itemId
			saveGridToStorage()
		}
	}
	
	todoModalRef.value?.close()
	resetTodoForm()
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

