<template>
	<div
		data-test="bx-form-root"
		class="max-h-[60vh] w-1/2 flex flex-col flex-wrap gap-2 border rounded p-1"
	>

		<p v-if="title" class="text-xl">{{ title }}</p>

		<BxFormField
			v-for="f in formDescription"
			:key="f.id"
			:fieldDesc="f"
		/>

	</div>
</template>


<script>
import {defineComponent} from 'vue'
import BxFormField from "@/components/UI/BxForm/BxFormField.vue";

export default defineComponent({
	name: "BxForm",

	components: {
		BxFormField,
	},

	props: {
		formDescription: {
			type: Array,
			default: () => [],
		},
		title: {
			type: String,
			default: null,
		}
	},


})
</script>


