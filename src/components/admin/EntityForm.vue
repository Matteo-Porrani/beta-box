<template>

	<div data-test="admin-form-root">

		<!-- THE FORM -->
		<BxForm
			ref="bxForm"
			:description="formDescription"
		/>

		<div class="h-4"></div>

		<!-- THE BUTTONS -->
		<div class="flex justify-between w-1/2 border rounded p-1">

			<button
				class="
					w-32 bg-stone-800 border border-yellow-400 text-yellow-400 hover:bg-yellow-950
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
import { mapActions, mapState } from "vuex";
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

	expose: ["onEditItem"],

	data() {
		return {}
	},

	computed: {
		...mapState({
			// entities: $s => $s.entity.entities,
			formValues: $s => $s.form.formValues,
		}),

		// rows() {
		// 	return this.entities[this.tableName] ?? [];
		// },
	},



	methods: {
		...mapActions("entity", [
			"addItem",
			"updateItem",
			"deleteItem",
		]),

		async onSave() {
			const action = isInteger(this.formValues.id)
				? "updateItem"
				: "addItem"

			const r = await this[action]({
				tableName: this.tableName,
				item: prepareItem(this.formValues)
			})

			console.log("save", r)

			this.onReset();
		},

		/**
		 * The public API of BxForm exposes 2 methods : initForm() & resetForm().
		 * Internally, only one method actually does the job (init),
		 * while the other one (reset) only executes the first one with an empty object {}.
		 * Clients of BxForm don't need to know this !! All they need is a clear and intuitive API :
		 * calling resetForm() is more intuitive than calling initForm({})
		 */
		onEditItem(item) {
			this.$refs.bxForm.initForm(item);
		},

		onDuplicateItem(item) {
			const clone = { ...item }
			delete clone.id;
			this.$refs.bxForm.initForm(clone);
		},

		onReset() {
			this.$refs.bxForm.resetForm();
		},

		async onDeleteItem(item) {
			await this.deleteItem({
				tableName: this.tableName,
				id: item.id
			});
		},
	}

};
</script>