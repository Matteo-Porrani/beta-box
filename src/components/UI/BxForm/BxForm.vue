<template>
	<div
		data-test="bx-form-root"
		class="max-h-[60vh] w-1/2 flex flex-col flex-wrap gap-2 border rounded p-1"
	>
		<BxFormField
			v-for="f in sortedDescription"
			:key="f.id"
			:ref="`fieldRef_${f.field}`"
			:fieldDesc="f"
		/>
	</div>
</template>


<script>
import { defineComponent } from 'vue'
import { mapMutations } from "vuex";
import BxFormField from "@/components/UI/BxForm/BxFormField.vue";

export default defineComponent({
	name: "BxForm",

	components: {
		BxFormField,
	},

	props: {
		description: {
			type: Array,
			required: true,
		}
	},

	expose: [
		"initForm",
		"resetForm",
	],

	data() {
		return {
			childrenRefs: {},
		}
	},

	computed: {
		sortedDescription() {
			return this.description
				.map(f => f) // create new array to avoid mutating prop
				.sort((a, b) => a.order - b.order);
		}
	},

	mounted() {
		for (const k of this.sortedDescription.map(f => f.field)) {
			this.childrenRefs[k] = this.$refs[`fieldRef_${k}`][0];
		}
	},

	methods: {
		...mapMutations("form", ["RESET_FORM"]),

		/**
		 * This method is only needed to be exposed
		 * to have a more intuitive API
		 */
		resetForm() {
			this.initForm({});
		},

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

			if (isReset) setTimeout(() => {
				this.RESET_FORM();
			}, 500);

		},

	}


})
</script>


