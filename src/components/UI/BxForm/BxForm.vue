<template>
	<div
		data-test="bx-form-root"
		class="h-[60vh] w-1/2 flex flex-col flex-wrap gap-2 border rounded p-1"
	>

		<BxFormField
			v-for="f in formDescription"
			:key="f.id"
			:fieldDesc="f"
			:formValues="formValues"
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
		formValues: {
			type: Object,
			required: true,
		}
	},


})
</script>


