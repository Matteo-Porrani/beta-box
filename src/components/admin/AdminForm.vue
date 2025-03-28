<template>
	<BxForm
		ref="bxForm"
		:formDescription="formDescription"
	/>

	<div class="h-4"></div>

	<div class="flex justify-between w-1/2 border rounded p-1">
		<button
			class="
			w-32 bg-teal-500 hover:bg-teal-400 disabled:bg-zinc-700
			disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800"
			@click="onSave"
		>
			{{ formValues.id ? 'Update' : 'Add' }}
		</button>

		<button
			class="
			w-32 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-700
			disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800"
			@click="onReset"
		>
			Reset
		</button>
	</div>



	<div class="h-12"></div>

	<BxTable
		:cols="formDescription.map(c => c.field)"
		:rows="rows"
		@edit-item="onEditItem"
		@duplicate-item="onDuplicateItem"
		@delete-item="onDeleteItem"
	/>


</template>


<script>
// Vue related
import { mapActions, mapState } from "vuex";
// utils
import { isFalsy } from "@/utils/core-utils";
import { prepareItem } from "@/utils/entity-utils";
// const
import { ENTITY_TEMP_DESC } from "@/const/const-admin";
// components
import BxForm from "@/components/UI/BxForm/BxForm.vue";
import BxTable from "@/components/UI/BxTable/BxTable.vue";


export default {

	name: "AdminForm",

	components: { BxTable, BxForm },

	data() {
		return {
			tableName: "color",
		}
	},

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
			formValues: $s => $s.form.formValues,
		}),

		formDescription() {
			return ENTITY_TEMP_DESC[this.tableName] ?? [];
		},

		rows() {
			return this.entities[this.tableName] ?? [];
		},
	},

	async mounted() {
		const r = await this.loadItems(this.tableName);
		console.log(r)
	},

	methods: {
		...mapActions("entity", [
			"loadItems",
			"addItem",
			"updateItem",
			"deleteItem",
		]),

		async onSave() {
			const action = !isFalsy(this.formValues.id)
				? "updateItem"
				: "addItem";

			const r = await this[action]({
				tableName: "color",
				item: prepareItem(this.formValues)
			})

			console.log("save", r)

			this.onReset();
		},

		/**
		 * The public API of BxForm exposes 2 methods : initForm() & resetForm().
		 * Internally, only one method actually does the job (init),
		 * while the other one (reset) only executes the first one with an empty object {}.
		 * Clients of BxForm don't need to know this !!
		 * All they need is a clear and intuitive API :
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