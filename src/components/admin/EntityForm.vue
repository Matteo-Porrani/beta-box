<!--
This is the last DOMAIN layer before the UI layer

BxForm is a graphic component. It doesn't know what it's dealing with.
All it knows is field names, field types & values.

EntityForm must pass :
- an already ordered description
- for LIST fields, description entry will have 'options' key with options to display in the list

-->




<template>
	<div data-test="admin-form-root">
		<!-- THE FORM -->
		<div class="w-1/2">
			<BxForm
				ref="bxForm"
				:description="formDescription"
				@field-value-changed="onFieldValueChanged"
			/>
		</div>
		<div class="h-4"></div>
		<!-- THE BUTTONS -->
		<div class="flex justify-between w-1/2 border border-stone-500 rounded p-1">
			<button
				class="
					w-32 bg-stone-800 border border-stone-500 text-stone-500 hover:bg-stone-900
					disabled:hover:cursor-not-allowed rounded py-2 px-6
				"
				@click="onReset"
			>
				Reset
			</button>
			<button
				class="
					w-32 bg-lime-600 border border-lime-600 hover:bg-lime-500
					disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800
				"
				@click="onSave"
			>
				{{ formValues.id ? 'Update' : 'Add' }}
			</button>
		</div>
	</div>
</template>


<script>
// Vue related
import { mapActions, mapMutations, mapState } from "vuex";
// utils
import { isInteger } from "@/utils/core-utils";
import { prepareItem } from "@/utils/entity-utils";
// components
import BxForm from "@/components/UI/BxForm/BxForm.vue";


export default {

	name: "EntityForm",

	components: {
		BxForm
	},

	props: {
		tableName: String,
		formDescription: Array,
	},

	emits: ["itemSaved"],

	expose: ["onEditItem"],

	computed: {
		...mapState({
			formValues: $s => $s.form.formValues,
		}),
	},

	methods: {
		...mapMutations("form", [
			"SET_FIELD",
			"RESET_FORM",
		]),
		...mapActions("entity", [
			"addItem",
			"updateItem",
			"deleteItem",
		]),

		onFieldValueChanged(changeData) {
			this.SET_FIELD(changeData);
		},

		async onSave() {
			const action = isInteger(this.formValues.id)
				? "updateItem"
				: "addItem"

			await this[action]({
				tableName: this.tableName,
				item: prepareItem(this.formValues)
			})

			this.onReset();
			this.$emit("itemSaved")
		},

		/**
		 * The public API of BxForm exposes 2 methods : initForm() & resetForm().
		 * Internally, only one method actually does the job (init),
		 * while the other one (reset) only executes the first one with an empty object {}.
		 * Clients of BxForm don't need to know this !! All they need is a clear and intuitive API :
		 * calling resetForm() is more intuitive than calling initForm({})
		 */


		// this method is called by parent AdminView when we switch to FORM mode
		onEditItem(item) {
			this.$refs.bxForm.initForm(item);
		},

		onReset() {
			this.$refs.bxForm.resetForm();
			setTimeout(() => {
				this.RESET_FORM();
			}, 300);
		},
	}

};
</script>