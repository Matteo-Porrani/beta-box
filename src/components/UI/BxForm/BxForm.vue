<template>
	<div
		data-test="bx-form-root"
		class="max-h-[60vh] w-1/2 flex flex-col flex-wrap gap-2 border rounded p-1"
	>
		<BxFormField
			v-for="f in formDescription"
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
		formDescription: {
			type: Array,
			default: () => [],
		}
	},

	expose: [
		"initForm",
	],

	data() {
		return {
			childrenRefs: {},
		}
	},

	mounted() {
		for (const k of this.formDescription.map(f => f.field)) {
			this.childrenRefs[k] = this.$refs[`fieldRef_${k}`][0];
		}
	},

	methods: {
		...mapMutations("form", ["RESET_FORM"]),

		initForm(values) {
			const isReset = Object.keys(values).length < 1;
			for (const k of this.formDescription.map(f => f.field)) {
				if (this.childrenRefs[k]) {
					const v = isReset
						? null
						: values[k];
					// set value on a single field
					this.childrenRefs[k].initField(v);
				}
			}

			if (isReset) setTimeout(() => {
				this.RESET_FORM();
			}, 500);

		},

	}


})
</script>


