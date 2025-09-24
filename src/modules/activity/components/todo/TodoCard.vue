<template>
	<div
		class="relative grid rounded border border-stone-600 transition-all duration-200"
		:class="[cardClasses, { 'cursor-move': !isEditing, 'cursor-text': isEditing }]"
		:draggable="!isEditing"
		@dragstart="handleDragStart"
	>
		<!-- Main content area -->
		<div class="font-cc grid overflow-y-hidden p-1">
			<!-- Editable text area -->
			<p
				v-if="!isEditing"
				:class="[
					'flex-1 leading-tight whitespace-pre-wrap break-words',
					textSizeClasses
				]"
				@dblclick.stop="startEditing"
			>
				{{ todo.desc }}
			</p>
			
			<!-- Edit mode textarea -->
			<textarea
				v-else
				ref="editInput"
				v-model="editText"
				:class="[
					'flex-1 bg-transparent leading-tight resize-none outline-none border-none overflow-hidden p-0',
					editTextSizeClasses
				]"
				style="text-align: left; vertical-align: top;"
				@keydown="handleKeyDown"
				@blur="saveEdit"
			/>
		</div>

		<!-- Position indicator -->
<!--		<div-->
<!--			v-if="position.row !== null && position.column !== null"-->
<!--			class="absolute bottom-1 left-1 text-xs px-1 py-0.5 bg-black bg-opacity-50 rounded text-white font-mono z-10"-->
<!--		>-->
<!--			C{{ position.column + 1 }}/R{{ position.row + 1 }}-->
<!--		</div>-->

		<!-- 3 dots menu button -->
		<button
			class="absolute top-1 right-1 w-5 h-5 rounded hover:bg-stone-600 flex items-center justify-center text-xs z-20 transition-colors duration-150"
			:class="[todo.starred ? 'text-white' : 'text-stone-800']"
			@click.stop="toggleColorSelector"
		>
			⋯
		</button>

		<!-- Color selector -->
		<ColorSelector
			v-if="showColorSelector"
			:todo="todo"
			:visible="showColorSelector"
			@update="handleTodoUpdate"
			@delete="handleTodoDelete"
			@copy="handleTodoCopy"
			@close="showColorSelector = false"
		/>
		
	</div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import { ACTIVITY_COLOR_MAP } from "@/modules/activity/const/activity-const";

import ColorSelector from './ColorSelector.vue'

const props = defineProps({
	todo: {
		type: Object,
		required: true
	},
	position: {
		type: Object,
		default: () => ({ row: null, column: null })
	},
	textSize: {
		type: Number,
		default: 1
	}
})

const emit = defineEmits(['update', 'delete', 'copy'])

const isEditing = ref(false)
const editText = ref('')
const showColorSelector = ref(false)
const editInput = ref(null)

const cardClasses = computed(() => {
	const baseClasses = []

	if (props.todo.starred) {
		// Title task styling: transparent background, no special border
		baseClasses.push('bg-transparent')
	} else {
		// Regular task styling
		baseClasses.push('hover:border-stone-500')

		// Color-based background classes for regular tasks
		const bgColor = (props.todo.done)
			? 'bg-green-500 line-through'
			: ACTIVITY_COLOR_MAP[props.todo.color] || 'bg-stone-700'
		baseClasses.push(bgColor)
	}

	return baseClasses
})

const textSizeClasses = computed(() => {
	if (props.todo.starred) {
		return 'text-lg font-semibold'
	} else {
		const sizeClass = Number(props.textSize) === 1 ? 'text-xs' : 'text-sm'
		return `${sizeClass} text-stone-800`
	}
})

const editTextSizeClasses = computed(() => {
	if (props.todo.starred) {
		return 'text-lg font-semibold text-white'
	} else {
		const sizeClass = Number(props.textSize) === 1 ? 'text-xs' : 'text-sm'
		return `${sizeClass} text-stone-800`
	}
})

function handleDragStart(event) {
	if (isEditing.value) {
		event.preventDefault()
		return
	}
	event.dataTransfer.setData('text/plain', props.todo.id.toString())
	event.dataTransfer.effectAllowed = 'move'
}

function startEditing() {
	isEditing.value = true
	editText.value = props.todo.desc
	
	nextTick(() => {
		if (editInput.value) {
			editInput.value.focus()
			editInput.value.select()
		}
	})
}

function handleKeyDown(event) {
	if (event.key === 'Tab') {
		event.preventDefault()
		saveEdit()
	}
	// Allow Enter for new lines (default behavior)
}

function saveEdit() {
	if (isEditing.value) {
		isEditing.value = false
		
		if (editText.value !== props.todo.desc) {
			emit('update', {
				...props.todo,
				desc: editText.value
			})
		}
	}
}

function handleTodoUpdate(updatedTodo) {
	emit('update', updatedTodo)
}

function handleTodoDelete() {
	emit('delete', props.todo.id)
}

function handleTodoCopy() {
	emit('copy', props.todo.id)
}

function toggleColorSelector() {
	showColorSelector.value = !showColorSelector.value
}

function handleClickOutside(event) {
	if (showColorSelector.value && !event.target.closest('.color-selector')) {
		showColorSelector.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>

