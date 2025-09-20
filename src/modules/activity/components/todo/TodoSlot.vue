<template>
	<div
		class="relative border border-dashed border-transparent rounded transition-colors duration-200"
		:class="{
			'border-yellow-400 bg-stone-600': isDragOver,
			'border-stone-500': !isDragOver && !isEmpty,
			'border-stone-600': !isDragOver && isEmpty
		}"
		@dragover.prevent="handleDragOver"
		@dragenter.prevent="handleDragEnter"
		@dragleave="handleDragLeave"
		@drop.prevent="handleDrop"
		@click="handleSlotClick"
	>
		<slot />
		
		<!-- Empty slot indicator -->
<!--		<div-->
<!--			v-if="isEmpty"-->
<!--			class="absolute inset-0 flex items-center justify-center text-stone-500 text-sm"-->
<!--		>-->
<!--			<span class="pointer-events-none">+</span>-->
<!--		</div>-->
	</div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
	row: {
		type: Number,
		required: true
	},
	column: {
		type: Number,
		required: true
	},
	todoId: {
		type: Number,
		default: null
	}
})

const emit = defineEmits(['drop', 'click'])

const isDragOver = ref(false)

const isEmpty = computed(() => props.todoId === null)

function handleDragOver(event) {
	event.dataTransfer.dropEffect = 'move'
	isDragOver.value = true
}

function handleDragEnter() {
	isDragOver.value = true
}

function handleDragLeave(event) {
	if (!event.currentTarget.contains(event.relatedTarget)) {
		isDragOver.value = false
	}
}

function handleDrop(event) {
	isDragOver.value = false
	const draggedTodoId = parseInt(event.dataTransfer.getData('text/plain'))
	
	emit('drop', {
		todoId: draggedTodoId,
		targetRow: props.row,
		targetColumn: props.column
	})
}

function handleSlotClick() {
	if (isEmpty.value) {
		emit('click', {
			row: props.row,
			column: props.column
		})
	}
}
</script>