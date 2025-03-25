<template>
	<div
		data-test="bx-form-field-root"
		class="border rounded p-1"
	>
		<label>Field</label>

		<template v-if="fieldType === 'T'">
			<input type="text">
		</template>

		<template v-if="fieldType === 'N'">
			<input type="number">
		</template>

		<template v-if="fieldType === 'B'">
			<input type="checkbox">
		</template>
	</div>
</template>


<script>
import {defineComponent} from 'vue'

export default defineComponent({
	name: "BxFormField",

	props: {
		fieldType: {
			type: String,
			default: "T"
		}
	}


})
</script>


