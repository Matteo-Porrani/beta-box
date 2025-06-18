<template>
	<div class="flex gap-24 border border-stone-500 rounded p-1">
		<!-- SORT -->
		<div class="flex items-center gap-2">
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
		<div class="flex items-center gap-2">
			<button
				class="bg-stone-700 hover:bg-stone-600 rounded py-1 px-2"
				@click="resetFilter"
			>
				<BxIcon icon="xmark"/>
			</button>

			<div class="relative w-72">
				<input type="text" v-model="filterNeedle" class="w-full">
				<BxIcon icon="search" class="absolute text-stone-500 right-1 top-1"/>
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

export default {
	name: "TheSortFilterBar",

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

	emits: ["sortFilterChange", "filterReset"],
	expose: ["setKeyToValue"],

	data() {
		return {
			sortByCol: "id",
			sortAsc: true,

			filterByCol: null,
			filterNeedle: "",
			showFilterByCol: false,
		}
	},

	beforeMount() {
		this.initSequence();
	},

	methods: {

		// ============================================= INIT

		initSequence() {
			this._setDefaultSortColumn();
			this._initSortFilterValues();
		},

		_setDefaultSortColumn() {
			if (this.columnOptions && Array.isArray(this.columnOptions) && this.columnOptions.length > 0) {
				this.sortByCol = this.columnOptions[0];
			}
		},

		_initSortFilterValues() {
			if (this.initValues) {
				for (const [k, v] of Object.entries(this.initValues)) {
					if (k === "filterByCol") this.showFilterByCol = true;
					nextTick(() => this[k] = v)
				}
			}
		},

		// ============================================= MUTATION FROM PARENT

		setKeyToValue(key, value) {
			this[key] = value;
		},

		// ============================================= UTILITY

		resetFilter() {
			this.filterNeedle = "";
			this.showFilterByCol = false;
			this.$emit("filterReset");
		},

		toggleOrder() {
			this.sortAsc = !this.sortAsc;
		}
	},

	watch: {

		initValues: {
			deep: true,
			handler() {
				this.initSequence();
			}
		},

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
