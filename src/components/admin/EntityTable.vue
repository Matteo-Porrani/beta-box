<template>
	<BxTable
		:cols="formDescription.map(c => c.field)"
		:rows="rows"
		content-height="70vh"
		@edit-item="onEditItem"
		@duplicate-item="onDuplicateItem"
		@delete-item="onDeleteItem"
	/>
</template>


<script>
// Vue related
import { mapActions, mapGetters, mapState } from "vuex";
// utils
import { nrm } from "@/utils/core-utils";
// components
import BxTable from "@/components/UI/BxTable/BxTable.vue";


export default {

	name: "EntityTable",

	components: {
		BxTable
	},

	props: {
		tableName: String,
		formDescription: Array,
	},

	emits: ["editItem",],

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
		}),

		...mapGetters("entity", [
			"getLabelFromListValue"
		]),

		rows() {
			if (!this.entities[this.tableName]) return [];
			// VERY IMPORTANT !!! normalize each 'r' object
			let rows = this.entities[this.tableName].map(r => nrm(r));

			// special sorting (group rows on 'list' or 'entity' column)
			if (this.tableName === 'list_option') {
				rows = rows.sort((a, b) => a.order - b.order).sort((a, b) => a.list.localeCompare(b.list))
			}
			if (this.tableName === 'field_definition') {
				rows = rows.sort((a, b) => a.order - b.order).sort((a, b) => a.entity.localeCompare(b.entity))
			}

			// show labels instead of values for lists
			rows = this.getListLabels(rows);

			return rows;
		},
	},

	methods: {

		...mapActions("entity", [
			"deleteItem",
		]),

		getListLabels(rows) {
			return rows.map(r => {
				for (const k of Object.keys(r)) {
					const match = this.formDescription.find(f => f.field === k);
					if (match && match.type === "L") {
						r[k] = this.getLabelFromListValue(match.list, r[k]);
					}
				}
				return r;
			});
		},

		/**
		 * The public API of BxForm exposes 2 methods : initForm() & resetForm().
		 * Internally, only one method actually does the job (init),
		 * while the other one (reset) only executes the first one with an empty object {}.
		 * Clients of BxForm don't need to know this !! All they need is a clear and intuitive API :
		 * calling resetForm() is more intuitive than calling initForm({})
		 */
		onEditItem(item) {
			console.log("EDIT ==>", JSON.stringify(item))
			this.$emit("editItem", item.id); // emit to AdminView
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