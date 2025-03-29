<template>

	<BxTable
		:cols="formDescription.map(c => c.field)"
		:rows="rows"
		@edit-item="onEditItem"
		@duplicate-item="onEditItem(true)"
		@delete-item="onDeleteItem"
	/>

</template>


<script>
import BxTable from "@/components/UI/BxTable/BxTable.vue";
import { mapActions, mapState } from "vuex";

export default {

	name: "EntityTable",

	components: {
		BxTable

	},

	props: {
		tableName: String,
		formDescription: Array,
	},

	emits: [
		"editItem",
	],

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
		}),

		rows() {
			return this.entities[this.tableName] ?? [];
		},
	},

	methods: {

		...mapActions("entity", [
			"deleteItem",
		]),

		/**
		 * The public API of BxForm exposes 2 methods : initForm() & resetForm().
		 * Internally, only one method actually does the job (init),
		 * while the other one (reset) only executes the first one with an empty object {}.
		 * Clients of BxForm don't need to know this !! All they need is a clear and intuitive API :
		 * calling resetForm() is more intuitive than calling initForm({})
		 */
		onEditItem(item, duplicate = false) {
			const copy =  { ...item };
			if (duplicate) delete copy.id;
			this.$emit("editItem", copy); // emit to AdminView
		},

		async onDeleteItem(item) {
			await this.deleteItem({ // call to store-entity action
				tableName: this.tableName,
				id: item.id
			});
		},
	}

}
</script>