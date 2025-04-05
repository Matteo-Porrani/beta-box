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
