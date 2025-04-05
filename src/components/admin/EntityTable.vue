<!-- 
EntityTable is a reusable table component for displaying and managing entity data in the admin interface.
It provides a standardized way to display tabular data with built-in actions (edit, duplicate, delete) for each row.

Key features:
- Displays data in a table format using BxTable component
- Supports custom column definitions through formDescription prop
- Handles special sorting for list_option and field_definition entities
- Automatically converts list values to their corresponding labels
- Provides row-level actions (edit, duplicate, delete)
- Integrates with Vuex store for data management:
  * Maps to the 'entity' module in the store
  * Uses mapState to access entities data
  * Uses mapGetters to access getLabelFromListValue for list value conversion
  * Uses mapActions to handle deleteItem operation
  * Maintains reactive data binding with the store

Props:
- tableName: String - Name of the entity table to display
- formDescription: Array - Array of column definitions with field and type information

Emits:
- editItem: When edit action is triggered
- duplicateItem: When duplicate action is triggered
- deleteItem: When delete action is triggered
-->

<template>
	<BxTable
		:cols="formDescription.map(c => c.field)"
		:rows="rows"
		:actions="actions"
		content-height="70vh"
		@row-action="onRowAction"
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

	emits: [
		"editItem",
		"duplicateItem",
		"deleteItem",
	],

	data() {
		return {
			actions: [
				{ name: "edit", icon: "edit" },
				{ name: "duplicate", icon: "copy" },
				{ name: "delete", icon: "trash" },
			],
		}
	},

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

		// =============================================
		// EVENT HANDLERS
		// =============================================

		onRowAction(payload) {
			const { action, data } = payload;
			this.emitSpecificEvent(action, data.id);
		},

		emitSpecificEvent(action, id) {
			this.$emit(`${action}Item`, id);
		},

		// =============================================
		// UTILITY
		// =============================================

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

	}

}
</script>
