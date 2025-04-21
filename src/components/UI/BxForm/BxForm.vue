<template>
	<div
		data-test="bx-form-root"
		class="max-h-[75vh] flex flex-col flex-wrap gap-2"
	>
		<BxFormField
			v-for="f in description"
			:key="f.id"
			:ref="`fieldRef_${f.field}`"
			:fieldDesc="f"
			@value-changed="e => $emit('fieldValueChanged', e)"
		/>
	</div>
</template>


<script>
import { defineComponent } from 'vue'
import BxFormField from "@/components/UI/BxForm/BxFormField.vue";

export default defineComponent({
	name: "BxForm",

	components: { BxFormField },

	props: {
		description: {
			type: Array,
			required: true,
		}
	},

	emits: ["fieldValueChanged"],
	expose: ["initForm", "resetForm",],

	data() {
		return {
			childrenRefs: {},
		}
	},

	mounted() {
		for (const k of this.description.map(f => f.field)) {
			this.childrenRefs[k] = this.$refs[`fieldRef_${k}`][0];
		}
	},

	methods: {
		initForm(values) {
			const isReset = Object.keys(values).length < 1;
			for (const field of this.description.map(f => f.field)) {
				if (this.childrenRefs[field]) {
					const v = isReset
						? null
						: values[field];
					// set value on a single field
					this.childrenRefs[field].initField(v);
				}
			}
		},

		/**
		 * This method is only exposed to provide a more intuitive API
		 */
		resetForm() {
			this.initForm({});
		},
	}

})
</script>

