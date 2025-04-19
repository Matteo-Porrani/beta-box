<template>
	<div class="grid grid-cols-2 gap-2 border border-stone-500 rounded p-1">
		<!-- SORT -->
		<div class="flex items-center gap-4">
			Sort
			<select v-model="sortByCol" class="w-48">
				<option
					v-for="c in columnOptions"
					:key="c"
					:value="c"
				>{{ c }}</option>
			</select>

			<button
				class="flex gap-2 items-center bg-stone-700 hover:bg-stone-600 rounded py-1 px-2 w-24"
				@click="toggleOrder"
			>
				<BxIcon icon="arrow_down" v-if="sortAsc"/>
				<BxIcon icon="arrow_up" v-else/>
				<span>{{ sortAsc ? 'ASC' : 'DESC' }}</span>
			</button>

		</div>

		<!-- FILTER -->
		<div class="flex items-center gap-4">
			<button
				class="bg-stone-700 hover:bg-stone-600 rounded py-1 px-2"
				@click="resetFilter"
			>
				<BxIcon icon="xmark"/>
			</button>

			<div class="relative w-64">
				<input type="text" v-model="filterNeedle" class="w-full">
				<BxIcon icon="search" class="absolute text-stone-300 right-1 top-1"/>
			</div>

			<BxSwitch v-model="showFilterByCol"/>

			<select
				v-if="showFilterByCol"
				v-model="filterByCol"
				class="w-48"
			>
				<option
					v-for="c in columnOptions"
					:key="c"
					:value="c"
				>{{ c }}</option>
			</select>
		</div>

	</div>
</template>


<script>
// Vue related
import { nextTick } from "vue";
//
import BxIcon from "@/components/UI/BxIcon.vue";
import BxSwitch from "@/components/UI/BxForm/fields/BxSwitch.vue";

export default {
	name: "TheSortFilterBar",
	components: { BxSwitch, BxIcon },

	props: {

		// @example ["one", "two", "three", "description"]
		columnOptions: {
			type: Array,
			default: () => []
		},

		// @example { sortByCol: "title", sortAsc: false, filterByCol: null, filterNeedle: "" }
		initValues: {
			type: Object,
			default: null,
		}

	},

	emits: ["sortFilterChange"],

	data() {

		return {
			sortByCol: "one",
			sortAsc: true,

			filterByCol: null,
			filterNeedle: "",
			showFilterByCol: false,
		}
	},

	beforeMount() {
		if (this.columnOptions && Array.isArray(this.columnOptions) && this.columnOptions.length > 0) {
			this.sortByCol = this.columnOptions[0];
		}

		if (this.initValues) {
			for (const [k, v] of Object.entries(this.initValues)) {
				// console.log("init", k, v)
				if (k === "filterByCol") this.showFilterByCol = true;
				nextTick(() => this[k] = v)
			}
		}
	},

	methods: {
		resetFilter() {
			this.filterNeedle = "";
		},

		toggleOrder() {
			this.sortAsc = !this.sortAsc;
		}
	},

	watch: {
		showFilterByCol(show) {
			this.filterByCol = show
				? this.columnOptions[0]
				: null;
		},

		sortByCol(newVal) {
			this.$emit("sortFilterChange", { key: "sortByCol", value: newVal })
		},

		sortAsc(newVal) {
			this.$emit("sortFilterChange", { key: "sortAsc", value: newVal })
		},

		filterByCol(newVal) {
			this.$emit("sortFilterChange", { key: "filterByCol", value: newVal })
		},

		filterNeedle(newVal) {
			this.$emit("sortFilterChange", { key: "filterNeedle", value: newVal })
		},

	}
}
</script>


<style scoped>
input,
select {
	@apply bg-stone-700 rounded text-stone-200 p-1
}
</style>
