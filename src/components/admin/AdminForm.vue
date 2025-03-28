<template>

<!--<pre>{{ formDescription }}</pre>-->

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
		@delete-item="onDeleteItem"
	/>


</template>


<script>
import { mapActions, mapState } from "vuex";
import {
	// ADMIN_FORM_DESC,
	// CATEGORY_FORM_DESC,
	COLOR_FORM_DESC,
} from "@/const/const-admin";
import BxForm from "@/components/UI/BxForm/BxForm.vue";
import BxTable from "@/components/UI/BxTable/BxTable.vue";

export default {

	name: "AdminForm",

	components: { BxTable, BxForm },

	data() {
		return {
			tableName: "color",
			formDescription: COLOR_FORM_DESC,

			categories: [
				{ id: 11, name: "sports", info: "some more info",  isFavorite: false, start: "2025-03-21@09:12", city: "M" },
				{ id: 25, name: "nature", info: "about the",  isFavorite: true, start: "2025-05-31@12:30", city: "R" },
				{ id: 36, name: "music", info: "some more info",  isFavorite: true, start: "2025-03-21@02:11", city: "P" },
			],

		}
	},

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
			formValues: $s => $s.form.formValues,
		}),

		rows() {
			return this.entities[this.tableName] ?? [];
		},
	},

	async mounted() {
		const r = await this.loadItems("color");
		console.log(r)
	},

	methods: {
		...mapActions("entity", [
			"loadItems",
			"addItem",
		]),

		async onSave() {
			console.log("SAVE")
			console.table(this.formValues)
			const r = await this.addItem({
				tableName: "color",
				newItem: { ...this.formValues },
			})
			console.log("save", r)
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
			console.log("@ ADMIN", item)
			this.$refs.bxForm.initForm(item);
		},
		onDeleteItem(item) {
			console.log("@ ADMIN", item)
		},

		onReset() {
			this.$refs.bxForm.resetForm();
		},
	}

};
</script>