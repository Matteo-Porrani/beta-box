<template>
	<BxModal ref="modalRef">
		<template #header>
			<h2 class="font-bold text-3xl text-white">Grid Configuration</h2>
		</template>

		<template #body>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-stone-300 mb-2">
						Columns (3-8)
					</label>
					<input
						v-model.number="formData.columns"
						type="number"
						min="3"
						max="8"
						class="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
					/>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-stone-300 mb-2">
						Rows (5-10)
					</label>
					<input
						v-model.number="formData.rows"
						type="number"
						min="5"
						max="10"
						class="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
					/>
				</div>
				
				<div class="text-sm text-stone-400">
					Total slots: {{ totalSlots }}
				</div>
				
				<div v-if="hasValidationError" class="text-red-400 text-sm">
					{{ validationError }}
				</div>
			</div>
		</template>

		<template #footer>
			<div class="w-full flex justify-between">
				<BxButton
					type="soft"
					label="Cancel"
					@click="cancel"
				/>
				<div class="flex gap-2">
					<BxButton
						type="soft"
						label="Reset to Default"
						@click="resetToDefault"
					/>
					<BxButton
						label="Apply"
						:disabled="hasValidationError"
						@click="apply"
					/>
				</div>
			</div>
		</template>
	</BxModal>
</template>

<script setup>
import { ref, reactive, computed, watch, defineEmits, defineExpose } from 'vue'
import BxModal from '@/modules/ui/components/BxModal.vue'
import BxButton from '@/modules/ui/components/BxButton.vue'

const emit = defineEmits(['apply'])

const modalRef = ref(null)

const defaultConfig = {
	columns: 6,
	rows: 8
}

const formData = reactive({
	columns: defaultConfig.columns,
	rows: defaultConfig.rows
})

const totalSlots = computed(() => formData.columns * formData.rows)

const validationError = computed(() => {
	if (formData.columns < 3 || formData.columns > 8) {
		return 'Columns must be between 3 and 8'
	}
	if (formData.rows < 5 || formData.rows > 10) {
		return 'Rows must be between 5 and 10'
	}
	return null
})

const hasValidationError = computed(() => validationError.value !== null)

function open(currentConfig = defaultConfig) {
	formData.columns = currentConfig.columns
	formData.rows = currentConfig.rows
	modalRef.value?.open()
}

function cancel() {
	modalRef.value?.close()
}

function resetToDefault() {
	formData.columns = defaultConfig.columns
	formData.rows = defaultConfig.rows
}

function apply() {
	if (!hasValidationError.value) {
		const newConfig = {
			columns: formData.columns,
			rows: formData.rows
		}
		
		emit('apply', newConfig)
		modalRef.value?.close()
	}
}

defineExpose({
	open
})
</script>