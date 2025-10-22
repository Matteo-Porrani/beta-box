<!--
EntityForm is a form component that serves as the last domain layer before the UI layer in the admin interface.
It provides a standardized way to create and edit entity data through a form interface.

Key features:
- Wraps the BxForm UI component with domain-specific logic
- Handles form state management through Vuex store
- Provides form reset and save functionality
- Supports both create and update operations
- Maintains proper field ordering and list options
- Integrates with Vuex store for data management:
  * Maps to the 'form' module for form state management
  * Maps to the 'entity' module for data operations
  * Uses mapState to access formValues
  * Uses mapMutations for form field updates and resets
  * Uses mapActions for addItem and updateItem operations

Props:
- tableName: String - Name of the entity table being edited
- formDescription: Array - Ordered array of field descriptions with types and options

Emits:
- itemSaved: Emitted when an item is successfully saved

Exposed Methods:
- onEditItem: Public method to initialize form with existing item data

BxForm is a graphic component. It doesn't know what it's dealing with.
All it knows is field names, field types & values.

EntityForm must pass :
- an already ordered description
- for LIST fields, description entry will have 'options' key with options to display in the list

-->

<template>
	<section
		data-test="entity-form-root"
		class="max-w-[60vw]"
	>
		<BxForm
			ref="bxForm"
			:description="formDescription"
			@field-value-changed="onFieldValueChanged"
		/>

		<div class="h-4"></div>
		<!-- THE BUTTONS -->
		<div class="flex justify-between">
			<BxButton
				type="soft"
				label="Cancel"
				@click="onCancel"
			/>

			<BxButton
				:label="formValues.id ? 'Update' : 'Add'"
				@click="onSave"
			/>
		</div>
	</section>
</template>


<script>
// Vue related
import { mapActions, mapMutations, mapState } from "vuex";
// utils
import { isInteger } from "@/modules/core/utils/core-utils";
import { prepareItem } from "@/modules/admin/utils/entity-utils";

export default {

	name: "EntityForm",

	props: {
		tableName: String,
		formDescription: Array,
	},

	emits: ["itemSaved", "cancel"],
	expose: ["onEditItem"],

	computed: {
		...mapState({
			formValues: $s => $s.form.formValues,
		}),
	},

	mounted() {
		this.initBoolFields(); // on new items, boolean fields are set to false
	},

	methods: {
		...mapMutations("form", [
			"SET_FIELD",
			"RESET_FORM",
		]),
		...mapActions("entity", [
			"addItem",
			"updateItem",
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
		onEditItem(item) {
			// this method is called by parent AdminView when we switch to FORM mode
			this.$refs.bxForm.initForm(item);
		},

		onReset() {
			this.$refs.bxForm.resetForm();
			setTimeout(() => {
				this.RESET_FORM();
			}, 300);
		},

		onCancel() {
			this.onReset();
			this.$emit("cancel");
		},

		initBoolFields() {
			this.formDescription.forEach(descEntry => {
				if (descEntry.type === "B") this.SET_FIELD({ key: descEntry.field, value: false });
			});
		}
	}

};
</script>

