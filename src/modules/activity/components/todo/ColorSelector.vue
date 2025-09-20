<template>
	<div
		v-if="visible"
		class="absolute right-0 top-0 h-full flex flex-col justify-center z-10"
		style="width: 20%;"
		@click.stop
	>
		<div class="bg-stone-900 border border-stone-600 rounded-lg shadow-lg p-1 space-y-1">
			<!-- Title toggle button -->
			<button
				class="w-8 h-8 rounded border border-stone-500 flex items-center justify-center text-xs font-bold transition-colors duration-150"
				:class="{
					'bg-yellow-400 text-black border-yellow-400': todo.starred,
					'bg-stone-700 text-white hover:bg-stone-600': !todo.starred
				}"
				@click="toggleTitle"
			>
				T
			</button>
			
			<!-- Color options -->
			<button
				v-for="color in colorOptions"
				:key="color.code"
				class="w-8 h-8 rounded border transition-all duration-150"
				:class="[
					color.bgClass,
					{
						'border-white border-2': todo.color === color.code,
						'border-stone-500 hover:border-stone-400': todo.color !== color.code
					}
				]"
				:title="color.name"
				@click="selectColor(color.code)"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
	todo: {
		type: Object,
		required: true
	},
	visible: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update'])

const colorOptions = [
	{ code: '$D', name: 'Default', bgClass: 'bg-yellow-600' },
	{ code: '$A', name: 'Category A', bgClass: 'bg-blue-600' },
	{ code: '$B', name: 'Category B', bgClass: 'bg-purple-600' },
	{ code: '$C', name: 'Category C', bgClass: 'bg-green-600' },
	{ code: '$E', name: 'Category E', bgClass: 'bg-red-600' }
]

function toggleTitle() {
	emit('update', {
		...props.todo,
		starred: !props.todo.starred
	})
}

function selectColor(colorCode) {
	if (colorCode !== props.todo.color) {
		emit('update', {
			...props.todo,
			color: colorCode
		})
	}
}
</script>