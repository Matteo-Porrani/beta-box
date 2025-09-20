<template>
	<div
		class="relative h-full w-full rounded-lg border border-stone-600 transition-all duration-200"
		:class="[cardClasses, { 'cursor-move': !isEditing, 'cursor-text': isEditing }]"
		:draggable="!isEditing"
		@dragstart="handleDragStart"
	>
		<!-- Main content area -->
		<div class="p-2 h-full flex flex-col">
			<!-- Editable text area -->
			<div
				v-if="!isEditing"
				class="flex-1 text-sm text-white leading-relaxed whitespace-pre-wrap break-words"
				style="text-align: left; vertical-align: top;"
				@dblclick.stop="startEditing"
			>
				{{ todo.desc }}
			</div>
			
			<!-- Edit mode textarea -->
			<textarea
				v-else
				ref="editInput"
				v-model="editText"
				class="flex-1 bg-transparent text-sm text-white leading-relaxed resize-none outline-none border-none p-0"
				style="text-align: left; vertical-align: top;"
				@keydown="handleKeyDown"
				@blur="saveEdit"
			/>
		</div>

		<!-- Hover zone for color selector (right 20% of card) -->
		<div
			class="absolute top-0 right-0 h-full w-1/5 z-20"
			@mouseenter="showColorSelector = true"
			@mouseleave="showColorSelector = false"
		></div>

		<!-- Color selector -->
		<ColorSelector
			v-if="showColorSelector"
			:todo="todo"
			:visible="showColorSelector"
			@update="handleTodoUpdate"
		/>
		
		<!-- Title task indicator -->
		<div
			v-if="todo.starred"
			class="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-sm flex items-center justify-center"
		>
			<span class="text-xs font-bold text-black">T</span>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, nextTick, defineProps, defineEmits } from 'vue'
import ColorSelector from './ColorSelector.vue'

const props = defineProps({
	todo: {
		type: Object,
		required: true
	}
})

const emit = defineEmits(['update'])

const isEditing = ref(false)
const editText = ref('')
const showColorSelector = ref(false)
const editInput = ref(null)

const cardClasses = computed(() => {
	const baseClasses = ['hover:border-stone-500']
	
	// Color-based background classes
	const colorClasses = {
		'$D': 'bg-yellow-600',
		'$A': 'bg-blue-600',
		'$B': 'bg-purple-600',
		'$C': 'bg-green-600',
		'$E': 'bg-red-600'
	}
	
	const bgColor = colorClasses[props.todo.color] || 'bg-stone-700'
	baseClasses.push(bgColor)
	
	// Title task styling
	if (props.todo.starred) {
		baseClasses.push('ring-2 ring-yellow-400')
	}
	
	return baseClasses
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
</script>