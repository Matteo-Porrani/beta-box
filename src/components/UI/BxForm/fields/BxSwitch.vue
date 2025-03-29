<template>
	<label class="inline-flex items-center cursor-pointer">
		<input
			type="checkbox"
			class="sr-only peer"
			:checked="modelValue ?? false"
			@change="$emit('update:modelValue', $event.target.checked)"
		>
		<div
			class="
				relative w-11 h-6 rounded-full
				peer bg-stone-700
				peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
				peer-checked:after:border-white
				after:content-[''] after:absolute after:top-[2px] after:start-[2px]
				after:bg-stone-300 after:rounded-full
				after:size-5 after:transition-all peer-checked:bg-lime-600
			"
		/>
	</label>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'BxSwitch',
	
	props: {
		modelValue: {
			type: Boolean,
			required: false,
			default: false
		}
	},

	emits: ['update:modelValue']
})
</script> 