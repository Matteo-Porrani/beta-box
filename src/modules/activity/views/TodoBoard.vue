<template>
	<section class="h-full grid grid-rows-[auto_1fr]">
		<!-- Toolbar -->
		<div class="toolbar flex items-center gap-8 p-1">
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
					class="w-[50vw] bg-stone-800 rounded text-white p-1"
				/>
				<BxButton
					label="Add"
					size="small"
					:disabled="!todoForm.desc"
					@click="saveTodo"
				/>
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
							@copy="handleTodoCopy"
						/>
					</TodoSlot>
				</template>
			</div>
		</div>

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
	</section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useBoardManagement } from '../composables/useBoardManagement.js'
import { useTodoOperations } from '../composables/useTodoOperations.js'
import { useGridConfig } from '../composables/useGridConfig.js'

import TodoSlot from '../components/todo/TodoSlot.vue'
import TodoCard from '../components/todo/TodoCard.vue'

// Store
const store = useStore()

// Reactive data
const boardItems = ref([])
const matrixData = ref({})
const currentBoardId = ref(1)

// Grid configuration composable
const {
	MAX_COLUMNS,
	MAX_ROWS,
	gridConfig,
	multiboardData,
	gridStyle,
	loadGridFromStorage,
	adjustColumns,
	adjustRows
} = useGridConfig(boardItems, matrixData)

// Board management composable
const {
	newBoardModal,
	boardNameInput,
	newBoardName,
	isEditingBoard,
	currentBoard,
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
	isEditingTodo,
	nextAvailableSlot,
	getTodoById,
	getTodoPosition,
	handleTodoDrop,
	handleTodoUpdate,
	handleTodoDelete,
	handleTodoCopy,
	resetTodoForm,
	saveTodo
} = useTodoOperations(store, tasks, multiboardData, currentBoardId, matrixData)

// Computed values
const currentMatrix = computed(() => matrixData.value[currentBoardId.value] || [])



// Lifecycle
onMounted(async () => {
	const activeBoardId = loadGridFromStorage()
	currentBoardId.value = activeBoardId
	await store.dispatch('entity/loadItems', 'task')
})
</script>

