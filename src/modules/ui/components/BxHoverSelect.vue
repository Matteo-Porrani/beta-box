<template>
	<div
		class="bx-hover-select relative inline-block"
		tabindex="0"
		@mouseenter="openOnHover"
		@mouseleave="closeOnHover"
		@keydown.escape="showOptions = false"
		@keydown.enter.prevent="toggleOptions"
		@keydown.down.prevent="navigateDown"
		@keydown.up.prevent="navigateUp"
	>
		<!-- Selected value display -->
		<div
			class="selected-value w-56 bg-stone-800 text-white rounded p-1 text-xs border cursor-pointer transition-colors"
		:class="showOptions ? 'border-sky-500' : 'border-stone-600 hover:border-stone-500'"
		>
			{{ selectedLabel }}
		</div>

		<!-- Options dropdown -->
		<transition name="fade">
			<div
				v-show="showOptions"
				class="options-dropdown absolute top-full left-0 w-56 mt-1 bg-stone-800 border border-stone-600 rounded shadow-lg z-50 max-h-64 overflow-y-auto"
			>
				<div
					v-for="(option, index) in options"
					:key="optionKey(option)"
					@click="selectOption(option)"
					class="option-item p-1 text-xs cursor-pointer hover:bg-stone-700 transition-colors"
					@mouseenter="highlightedIndex = index"
				:class="{
					'bg-sky-500 text-stone-800 font-semibold': isSelected(option),
					'bg-stone-700 text-yellow-400': !isSelected(option) && highlightedIndex === index,
					'text-white': !isSelected(option) && highlightedIndex !== index
				}"
				>
					{{ optionLabel(option) }}
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue"

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: null
	},
	options: {
		type: Array,
		default: () => []
	},
	labelKey: {
		type: String,
		default: "name"
	},
	valueKey: {
		type: String,
		default: "id"
	}
})

const emit = defineEmits(["update:modelValue", "change"])

const showOptions = ref(false)
const highlightedIndex = ref(-1)

const selectedLabel = computed(() => {
	const selected = props.options.find(option =>
		optionValue(option) === props.modelValue
	)
	return selected ? optionLabel(selected) : "Select an option..."
})

function optionLabel(option) {
	return typeof option === "object" ? option[props.labelKey] : option
}

function optionValue(option) {
	return typeof option === "object" ? option[props.valueKey] : option
}

function optionKey(option) {
	return optionValue(option)
}

function isSelected(option) {
	return optionValue(option) === props.modelValue
}

function selectOption(option) {
	const value = optionValue(option)
	emit("update:modelValue", value)
	emit("change", value)
	showOptions.value = false
}

function toggleOptions() {
	if (showOptions.value && highlightedIndex.value >= 0) {
		// If dropdown is open and an option is highlighted, select it
		const option = props.options[highlightedIndex.value]
		selectOption(option)
	} else {
		// Otherwise toggle the dropdown
		showOptions.value = !showOptions.value
		if (showOptions.value) {
			// Reset highlighted index when opening
			highlightedIndex.value = -1
		}
	}
}

function navigateDown() {
	if (!showOptions.value) {
		showOptions.value = true
		highlightedIndex.value = 0
	} else {
		highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
	}
}

function navigateUp() {
	if (!showOptions.value) {
		showOptions.value = true
		highlightedIndex.value = props.options.length - 1
	} else {
		highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
	}
}

function openOnHover() {
	showOptions.value = true
	highlightedIndex.value = -1
}

function closeOnHover() {
	showOptions.value = false
	highlightedIndex.value = -1
}
</script>

<style scoped>
.bx-hover-select {
	@apply inline-block
}

.bx-hover-select:focus {
	@apply outline-none
}

.bx-hover-select:focus .selected-value {
	@apply ring-2 ring-sky-500 ring-opacity-50
}

.options-dropdown {
	/* Custom scrollbar styling */
	scrollbar-width: thin;
	scrollbar-color: #57534e #292524;
}

.options-dropdown::-webkit-scrollbar {
	@apply w-2
}

.options-dropdown::-webkit-scrollbar-track {
	@apply bg-stone-800
}

.options-dropdown::-webkit-scrollbar-thumb {
	@apply bg-stone-600 rounded
}

.options-dropdown::-webkit-scrollbar-thumb:hover {
	@apply bg-stone-500
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
