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
				v-model="value"
			>
		</template>

		<template v-if="fieldDesc.type === 'N'">
			<input
				type="number"
				class="w-24"
				:readonly="fieldDesc.readonly"
				v-model="value"
			>
		</template>

		<template v-if="fieldDesc.type === 'B'">
			<input
				type="checkbox"
				class="size-6 accent-teal-500"
				v-model="value"
			/>
		</template>
	</div>
</template>


<script>
import {defineComponent} from 'vue'
import { mapMutations } from "vuex";

export default defineComponent({
	name: "BxFormField",

	props: {
		fieldDesc: {
			type: Object,
			required: true,
		},
	},

	expose: ["initField"],

	data() {
		return {
			value: null
		}
	},

	watch: {
		value(newVal) {
			this.SET_FIELD({
				key: this.fieldDesc.field,
				value: newVal,
			})
		}
	},

	methods: {
		...mapMutations("form", ["SET_FIELD"]),

		initField(initVal) {
			this.value = initVal;
		}
	}

})
</script>


<style scoped>
input {
	@apply bg-stone-700 rounded text-stone-200 p-1
}
</style>

