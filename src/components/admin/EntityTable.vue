<template>

	<BxTable
		:cols="formDescription.map(c => c.field)"
		:rows="rows"
		@edit-item="onEditItem"
		@duplicate-item="onDuplicateItem"
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
			if (!this.entities[this.tableName]) return [];
			let rows = this.entities[this.tableName].map(r => r);

			// special sorting (group rows on 'list' or 'entity' column)
			if (this.tableName === 'list_option') {
				rows = rows.sort((a, b) => a.order - b.order).sort((a, b) => a.list.localeCompare(b.list))
			}

			if (this.tableName === 'field_definition') {
				rows = rows.sort((a, b) => a.order - b.order).sort((a, b) => a.entity.localeCompare(b.entity))
			}

			return rows;
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
		onEditItem(item) {
			console.log("==>", JSON.stringify(item))
			this.$emit("editItem", item); // emit to AdminView
		},

		onDuplicateItem(item) {
			delete item.id;
			this.onEditItem(item, true);
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