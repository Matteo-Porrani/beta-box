<template>

	<div class="grid grid-cols-2 gap-2 border border-lime-500 rounded p-1">

		<!-- SORT -->
		<div class="flex items-center gap-4">
			Sort
			<select v-model="sortBy" class="w-48">
				<option
					v-for="c in mock.cols"
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
				<input type="text" v-model="filterMatch" class="w-full">
				<BxIcon icon="search" class="absolute text-stone-300 right-1 top-1"/>
			</div>

			<BxSwitch v-model="showFilterByCol"/>

			<select
				v-if="showFilterByCol"
				v-model="filterBy"
				class="w-48"
			>
				<option
					v-for="c in mock.cols"
					:key="c"
					:value="c"
				>{{ c }}</option>
			</select>

		</div>

	</div>



</template>

<script>
import BxIcon from "@/components/UI/BxIcon.vue";
import BxSwitch from "@/components/UI/BxForm/fields/BxSwitch.vue";

export default {
	name: "TheSortFilterBar",
	components: { BxSwitch, BxIcon },

	data() {

		return {
			sortBy: "one",
			sortAsc: true,
			filterBy: "one",
			filterMatch: "",
			showFilterByCol: false,
			mock: {
				cols: ["one", "two", "three", "description"]
			}
		}
	},

	methods: {
		resetFilter() {
			this.filterBy = "";
		},

		toggleOrder() {
			this.sortAsc = !this.sortAsc;
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
