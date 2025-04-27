<template>
	<table class="rounded overflow-hidden w-full">
		<tbody>
		<BxTableRow
			is-header
			:cols="cols"
			:row="headerRow"
			:actions="actions"
		/>
		<div class="table-content">
			<BxTableRow
				v-for="r in rows"
				:key="r.id"
				:cols="cols"
				:row="r"
				:actions="actions"
				@row-action="onRowAction"
			/>
		</div>
		</tbody>
	</table>
</template>


<script>

export default {
	name: "BxTable",

	props: {
		cols: Array,
		rows: Array,
		actions: {
			type: [Array, null],
			default: null,
		},
		contentHeight: {
			type: String,
			default: "unset"
		}
	},

	emits: [ "rowAction" ],

	computed: {
		headerRow() {
			return this.cols.reduce((acc, col) => {
				acc[col] = col;
				return acc;
			}, {})
		}
	},

	methods: {
		onRowAction(payload) {
			this.$emit("rowAction", payload);
		},
	}
}
</script>


<style scoped>
.table-content {
	height: v-bind(contentHeight);
	overflow-y: auto;
}
</style>

