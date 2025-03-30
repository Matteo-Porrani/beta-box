<template>
	<tr>
		<component
			:is="isHeader ? 'th' : 'td'"
			v-for="c in cols"
			:key="c"
			:data-field="c"
		>
			{{ row[c] }}
		</component>
		<component
			:is="isHeader ? 'th' : 'td'"
			class="space-x-4"
		>
			<template v-if="!isHeader">
				<button
					v-for="b in buttons"
					:key="b[1]"
				>
					<BxIcon
						:icon="b[1]"
						size="small"
						@click="onAction(b[0])"
					/>
				</button>
			</template>
		</component>
	</tr>
</template>


<script>
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "BxTableRow",

	components: { BxIcon },

	props: {
		cols: Array,
		row: Object,
		isHeader: Boolean
	},

	emits: [
		"editItem",
		"deleteItem",
		"duplicateItem",
	],

	data() {
		return {
			buttons: [
				["editItem", "edit"],
				["duplicateItem", "copy"],
				["deleteItem", "trash"],
			]
		}
	},

	methods: {
		onAction(action) {
			this.$emit(`${action}`, this.row);
		}
	}
}
</script>

<style scoped>
tr:has(td:hover),
tr:has(td:hover) > td[data-field="id"] {
	@apply bg-stone-900
}

th,
td {
	@apply border border-stone-700 text-sm py-1 px-2
}

th,
td[data-field="id"] {
	@apply text-lime-600 bg-stone-700 font-bold text-start
}


</style>