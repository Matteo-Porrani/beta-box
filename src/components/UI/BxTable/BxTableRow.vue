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
				<button>
					<BxIcon
						icon="edit"
						size="small"
						@click="onAction('editItem')"
					/>
				</button>
				<button>
					<BxIcon
						icon="trash"
						size="small"
						@click="onAction('deleteItem')"
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
	],

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