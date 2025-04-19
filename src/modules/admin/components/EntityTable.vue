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
	<div class="entity-table-root">

		<TheSortFilterBar
			:column-options="cols"
			:init-values="sortFilterInitValues"
			@sort-filter-change="onSortFilterChange"
		/>

		<div class="h-2"></div>

		<BxTable
			:cols="formDescription.map(c => c.field)"
			:rows="rows"
			:actions="actions"
			content-height="65vh"
			@row-action="onRowAction"
		/>
	</div>
</template>


<script>
// Vue related
import { mapState, mapGetters } from "vuex";
// utils
import { nrm } from "@/modules/core/utils/core-utils";
import { sortRows, filterTableByNeedle} from "@/modules/core/utils/table-utils";
// components
import BxTable from "@/components/UI/BxTable/BxTable.vue";
import TheSortFilterBar from "@/modules/core/components/TheSortFilterBar.vue";


export default {

	name: "EntityTable",

	components: {
		TheSortFilterBar,
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
			sortByCol: "id",
			sortAsc: true,

			showFilterByCol: false,
			filterByCol: null,
			filterNeedle: "",

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

		...mapGetters("entity", ["getLabelFromListValue"]),

		cols() {
			return this.formDescription
				? this.formDescription.map(f => f.field)
				: [];
		},

		rows() {
			if (!this.entities[this.tableName]) return [];

			// VERY IMPORTANT !!! normalize each 'r' object
			let rows = this.entities[this.tableName].map(r => nrm(r));

			// sort & filter
			rows = sortRows(rows, this.sortByCol, this.sortAsc);
			rows = filterTableByNeedle(rows, this.filterNeedle, this.filterByCol);

			// show labels instead of values for lists
			rows = this.getListLabels(rows);

			return rows;
		},

		sortFilterInitValues() {
			const specificSort = {
				list_option: { sortByCol: "list" },
				field_definition: { sortByCol: "entity" },
				ticket: { sortByCol: "title" },
			}

			return Object.keys(specificSort).includes(this.tableName)
				? specificSort[this.tableName]
				: {};
		},

	},

	methods: {

		// ============================================= EVENT HANDLERS

		// react to changes in sort or filter
		onSortFilterChange(e) {
			const { key, value } = e;
			this[key] = value;
		},

		onRowAction(payload) {
			const { action, data } = payload;
			this.emitSpecificEvent(action, data.id);
		},

		emitSpecificEvent(action, id) {
			this.$emit(`${action}Item`, id);
		},

		// ============================================= UTILITY

		getListLabels(rows) {
			return rows.map(r => {
				for (const k of Object.keys(r)) {
					const match = this.formDescription.find(f => f.field === k);
					if (match && match.type === "L") {
						const code = r[k];
						const label = this.getLabelFromListValue(match.list, r[k]);

						r[k] = `[${code}] ${label}`;
					}
				}
				return r;
			});
		},

	}

}
</script>

