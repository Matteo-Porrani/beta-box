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

		<div class="grid grid-cols-2 gap-2 border border-stone-500 rounded p-1">
			<!-- FILTER -->
			<div class="flex items-center gap-4">
				<button
					class="bg-stone-700 hover:bg-stone-600 rounded py-1 px-4"
					@click="resetFilter">Reset</button>
				<p>Filter</p>
				<select v-model="filterBy">
					<option
						v-for="c in cols"
						:key="c"
						:value="c"
					>{{ c }}</option>
				</select>
				<input type="text" v-model="filterMatch">
			</div>

			<!-- SORT -->
			<div class="flex items-center gap-4">
				Sort
				<select v-model="sortBy">
					<option
						v-for="c in cols"
						:key="c"
						:value="c"
					>{{ c }}</option>
				</select>

				<select v-model="sortOrder">
					<option :value="0">ASC</option>
					<option :value="1">DESC</option>
				</select>
			</div>
		</div>

		<div class="h-2"/>

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
			sortBy: "id",
			sortOrder: 0,
			filterBy: "id",
			filterMatch: null,

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

		cols() {
			return this.formDescription
				? this.formDescription.map(f => f.field)
				: [];
		},

		rows() {
			if (!this.entities[this.tableName]) return [];

			// VERY IMPORTANT !!! normalize each 'r' object
			let rows = this.entities[this.tableName].map(r => nrm(r));

			// apply sorting based on table configuration
			rows = this.applySorting(rows);

			rows = this.applyCustomSorting(rows, this.sortBy, this.sortOrder);

			rows = this.applyFilter(rows, this.filterBy, this.filterMatch);

			// show labels instead of values for lists
			rows = this.getListLabels(rows);

			return rows;
		},

		/**
		 * Defines sorting configuration for different table types
		 * @returns {Object|undefined} Configuration object containing:
		 *   - orderBy: field to sort records by (e.g., 'order')
		 *   - groupBy: field to group records by (e.g., 'list', 'entity')
		 */
		sortConfig() {
			const config = {
				// Sort 'list_options' first by order, then group by list name
				'list_option': { orderBy: 'order', groupBy: 'list' },
				// Sort 'field_definitions' first by order, then group by entity name
				'field_definition': { orderBy: 'order', groupBy: 'entity' }
			};
			return config[this.tableName];
		},
	},

	mounted() {
		console.log("MOUNTED -- EntityTable")
	},

	methods: {

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

		/**
		 * Applies multi-level sorting to rows based on configuration
		 * @param {Array} rows - Array of row objects to sort
		 * @returns {Array} Sorted array of rows
		 * 
		 * Example:
		 * For list_option table:
		 * 1. First sorts by 'order' field numerically
		 * 2. Then sorts by 'list' field alphabetically
		 */
		applySorting(rows) {
			const config = this.sortConfig;
			// Return original rows if no sorting config exists for this table
			if (!config) return rows;

			return rows
				// Primary sort: numeric sort by orderBy field (e.g., 'order')
				.sort((a, b) => a[config.orderBy] - b[config.orderBy])
				// Secondary sort: alphabetical sort by groupBy field (e.g., 'list' or 'entity')
				.sort((a, b) => a[config.groupBy].localeCompare(b[config.groupBy]));
		},

		applyCustomSorting(rows, byKey, order) {
			const sortedRows = rows.sort((a, b) => {
				const valA = a[byKey];
				const valB = b[byKey];
				
				// If both values are numbers, compare numerically
				if (!isNaN(valA) && !isNaN(valB)) {
					return Number(valA) - Number(valB);
				}
				
				// Otherwise, compare as strings
				return String(valA).localeCompare(String(valB));
			});
			
			if (order > 0) sortedRows.reverse();
			return sortedRows;
		},

		// =============================================
		// FILTERING
		// =============================================

		applyFilter(rows, byKey, match) {
			if (!match) return rows;
			return rows.filter(r => {
				return String(r[byKey]).includes(match);
			})
		},

		resetFilter() {
			this.filterBy = "id";
			this.filterMatch = null;
		}

	}

}
</script>

<style scoped>
input,
select {
	@apply bg-stone-700 rounded text-stone-200 p-1
}
</style>