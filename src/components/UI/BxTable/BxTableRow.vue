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
			console.log("@", action)
			this.$emit(`${action}`, this.row);
		}
	}
}
</script>

<style scoped>
th,
td {
	@apply p-2 border border-stone-700
}

th,
td[data-field="id"] {
	@apply text-yellow-500 bg-stone-700 font-bold min-w-24 text-start p-2
}
</style>