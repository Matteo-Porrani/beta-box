<template>
	<div
		class="bx-hover-select relative inline-block"
		@mouseenter="showOptions = true"
		@mouseleave="showOptions = false"
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
					v-for="option in options"
					:key="optionKey(option)"
					@click="selectOption(option)"
					class="option-item p-1 text-xs cursor-pointer hover:bg-stone-700 transition-colors"
					:class="isSelected(option) ? 'bg-sky-500 text-stone-800 font-semibold' : 'text-white'"
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
</script>

<style scoped>
.bx-hover-select {
	@apply inline-block
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
