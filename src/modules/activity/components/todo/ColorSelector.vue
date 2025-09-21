<template>
	<div
		v-if="visible"
		class="absolute top-1 right-1 z-30 space-y-1 bg-stone-800 rounded p-1"
		@click.stop
	>
		<div 
			class="flex gap-0.5"
			@click.stop
		>
			<!-- Title toggle button -->
			<button
				class="size-5 rounded border border-stone-500 flex items-center justify-center text-xs font-bold transition-colors duration-150"
				:class="{
					'border-2 border-yellow-400': todo.starred,
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
				class="size-5 rounded border transition-all duration-150"
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

		<div>
			<BxIconButton
				type="danger"
				icon="trash"
				label="Delete"
				size="small"
				class="ml-auto"
				@click="emit('delete')"
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

const emit = defineEmits(['update', 'close', 'delete'])

const colorOptions = [
	{ code: '$D', bgClass: 'bg-yellow-300' },
	{ code: '$E', bgClass: 'bg-orange-400' },
	{ code: '$A', bgClass: 'bg-sky-400' },
	{ code: '$B', bgClass: 'bg-violet-500' },
	{ code: '$C', bgClass: 'bg-emerald-500' }
]

function toggleTitle() {
	emit('update', {
		...props.todo,
		starred: !props.todo.starred
	})
	emit('close')
}

function selectColor(colorCode) {
	if (colorCode !== props.todo.color) {
		emit('update', {
			...props.todo,
			color: colorCode
		})
	}
	emit('close')
}
</script>