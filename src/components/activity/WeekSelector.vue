<template>
	<div class="grid place-content-center mb-4">

		<div class="option-selector border border-stone-600 flex gap-4 w-fit rounded p-1">

			<button @click="stepByOne(0)">
				&lt;
			</button>

			<select
				v-model="selectedWeekId"
			>
				<option
					v-for="o in weekOptions"
					:key="o.id"
					:value="o.id"
				>
					{{ o.label }}
				</option
				>
			</select>

			<button @click="stepByOne(1)">
				&gt;
			</button>

		</div>

	</div>
</template>


<script>
import { weekSelectorController } from "@/controller/WeekSelectorController";

export default {

	name: "WeekSelector",

	emits: ["weekSelected"],

	data() {
		return {
			weekOptions: null,
			selectedWeekId: null,
		}
	},

	watch: {
		selectedWeekId(newId) {
			this.$emit("weekSelected", newId);
		}
	},

	mounted() {
		this.weekOptions = weekSelectorController.getWeekOptions();
		this.selectedWeekId = this.weekOptions ? this.weekOptions.at(-1).id : 1;
	},

	methods: {
		stepByOne(dir = 0) {
			// 0 is prev | 1 is next
			let posIdx = this.weekOptions.findIndex(o => o.id === this.selectedWeekId);
			posIdx = dir ? posIdx + 1 : posIdx - 1;

			const target = this.weekOptions[posIdx];
			if (!target) return;

			this.selectedWeekId = this.weekOptions[posIdx].id;
		}
	}

}
</script>


<style scoped>
button {
	@apply bg-stone-700 w-12 rounded p-1
}
select {
	@apply bg-stone-700 w-96 rounded text-stone-200 p-1 text-lg text-center
}
</style>
