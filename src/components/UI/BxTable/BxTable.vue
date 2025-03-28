<template>
	<table class="rounded overflow-hidden">
		<tbody>
		<BxTableRow
			is-header
			:cols="cols"
			:row="headerRow"
		/>
			<BxTableRow
				v-for="r in rows"
				:key="r.id"
				:cols="cols"
				:row="r"
				@edit-item="onEditItem"
				@duplicate-item="onDuplicateItem"
				@delete-item="onDeleteItem"
			/>
		</tbody>
	</table>
</template>
<script>
import BxTableRow from "@/components/UI/BxTable/BxTableRow.vue";

export default {
	name: "BxTable",

	components: {
		BxTableRow,
	},

	props: {
		cols: Array,
		rows: Array,
	},

	emits: [
		"editItem",
		"duplicateItem",
		"deleteItem",
	],

	computed: {
		headerRow() {
			return this.cols.reduce((acc, col) => {
				acc[col] = col;
				return acc;
			}, {})
		}
	},

	methods: {
		onEditItem(item) {
			this.$emit("editItem", item);
		},
		onDuplicateItem(item) {
			this.$emit("duplicateItem", item);
		},
		onDeleteItem(item) {
			this.$emit("deleteItem", item);
		},
	}
}
</script>


