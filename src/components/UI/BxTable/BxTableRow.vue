<template>
	<tr>
		<component
			:is="isHeader ? 'th' : 'td'"
			v-for="c in cols"
			:key="c"
			:data-field="c"
			:class="textColorClass(row[c])"
		>
			<div class="cell-content" v-html="valueRenderer(row[c])"></div>
		</component>
		<component
			:is="isHeader ? 'th' : 'td'"
			class="space-x-2"
			data-field="actions"
		>
			<template v-if="!isHeader">
				<button
					v-for="a in actions"
					:key="a.name"
					@click="onAction(a.name)"
				>
					<BxIcon
						:icon="a.icon"
						size="small"
					/>
				</button>
			</template>
		</component>
	</tr>
</template>


<script>
import { nrm } from "@/utils/core-utils";
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "BxTableRow",

	components: { BxIcon },

	props: {
		cols: { type: Array, required: true },
		row: { type: Object, required: true },
		isHeader: { type: Boolean, default: false },
		actions: { type: [Array, null], required: true }
	},

	emits: [ "rowAction" ],

	computed: {
		valueRenderer() {
			const svgTemplate = (content) => `
				<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
					fill="none" stroke="currentColor" stroke-width="2" 
					stroke-linecap="round" stroke-linejoin="round">
					${content}
				</svg>`;

			const icons = {
				true: svgTemplate('<polyline points="20 6 9 17 4 12"></polyline>'),
				false: svgTemplate(`
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				`)
			};

			return function(value) {
				if (![true, false].includes(value)) return value;
				return icons[value];
			}
		},

		textColorClass() {
			return function (value) {
				if (![true, false].includes(value)) return "";
				return value === true
					? "text-lime-600"
					: "text-rose-700"
			}
		},

		colsCount() {
			return this.cols.length;
		},

		templateColumns() {
			return `auto repeat(${this.colsCount}, 1fr)`
		}
	},

	methods: {
		onAction(actionName) {
			this.$emit("rowAction", {
				action: actionName,
				data: nrm(this.row),
			});
		}
	}
}
</script>


<style scoped>
tr {
	display: grid;
	grid-template-columns: v-bind(templateColumns);
}

.cell-content {
	@apply overflow-hidden text-ellipsis whitespace-nowrap;
}

tr:has(td:hover),
tr:has(td:hover) > td[data-field="id"] {
	@apply bg-stone-900
}

th,
td {
	@apply border border-stone-700 text-sm overflow-hidden py-1 px-2
}

th,
td[data-field="id"] {
	@apply text-lime-600 bg-stone-700 font-bold text-start
}

th[data-field="id"],
td[data-field="id"] {
	min-width: 60px;
}

th[data-field="actions"],
td[data-field="actions"] {
	min-width: 80px;
}
</style>
