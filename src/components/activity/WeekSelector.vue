<template>
	<div class="grid place-content-center mb-4">

		<div class="option-selector border border-stone-600 flex gap-4 w-fit rounded p-1">

			<button>
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

			<button>
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
