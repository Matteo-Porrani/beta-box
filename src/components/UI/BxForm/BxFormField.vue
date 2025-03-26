<template>
	<div
		data-test="bx-form-field-root"
		class="flex flex-col w-72 h-16 border rounded p-1"
	>
		<label class="text-sm">{{ fieldDesc.field }}</label>

		<template v-if="fieldDesc.type === 'T'">
			<input
				type="text"
				class="w-full"
				:readonly="fieldDesc.readonly"
			>
		</template>

		<template v-if="fieldDesc.type === 'N'">
			<input
				type="number"
				class="w-24"
				:readonly="fieldDesc.readonly"
			>
		</template>

<!--		<template v-if="fieldDesc.type === 'B'">-->
<!--			<input-->
<!--				type="checkbox"-->
<!--				class="size-6"-->
<!--				:readonly="fieldDesc.readonly"-->
<!--			>-->
<!--		</template>-->

		<template v-if="fieldDesc.type === 'B'">
			<span class="relative mt-1">
				<input
					type="checkbox"
					class="sr-only peer"
				/>
				<span
					class="
						block w-11 h-6 bg-stone-400 rounded-full
						peer peer-checked:after:translate-x-full peer-checked:after:border-white
						after:content-[''] after:absolute after:top-[2px] after:left-[2px]
						after:bg-white after:border-gray-300 after:border after:rounded-full
						after:size-5 after:transition-all peer-checked:bg-teal-500"
				></span>
			</span>
		</template>
	</div>
</template>


<script>
import {defineComponent} from 'vue'

export default defineComponent({
	name: "BxFormField",

	props: {
		fieldDesc: {
			type: Object,
			required: true,
		},
	}


})
</script>


<style scoped>
input {
	@apply bg-stone-700 rounded text-stone-200 p-1
}


</style>

