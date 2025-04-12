<template>
	<div class="grid place-content-center mb-4">

		<div class="option-selector border border-stone-600 flex gap-4 w-fit rounded p-1">

			<button @click="stepByOne(0)">
				<BxIcon icon="caret_left"/>
			</button>

			<select
				v-model="selectedValue"
			>
				<option
					v-for="o in selectOptions"
					:key="o.id"
					:value="o.id"
				>
					{{ o.label }}
				</option
				>
			</select>

			<button @click="stepByOne(1)">
				<BxIcon icon="caret_right"/>
			</button>

		</div>

	</div>
</template>


<script>
import { weekSelectorController } from "@/controller/WeekSelectorController";
import BxIcon from "@/components/UI/BxIcon.vue";

export default {

	name: "BxOptionSelector",
	components: { BxIcon },

	emits: ["weekSelected"],

	data() {
		return {
			selectOptions: null,
			selectedValue: null,
		}
	},

	watch: {
		selectedValue(newId) {
			this.$emit("weekSelected", newId);
		}
	},

	mounted() {
		this.selectOptions = weekSelectorController.getWeekOptions();
		this.selectedValue = this.selectOptions && Array.isArray(this.selectOptions) && this.selectOptions.length > 0
			? this.selectOptions.at(-1).id
			: 1;
	},

	methods: {
		stepByOne(dir = 0) {
			// 0 is prev | 1 is next
			let posIdx = this.selectOptions.findIndex(o => o.id === this.selectedValue);
			posIdx = dir ? posIdx + 1 : posIdx - 1;

			const target = this.selectOptions[posIdx];
			if (!target) return;

			this.selectedValue = this.selectOptions[posIdx].id;
		}
	}

}
</script>


<style scoped>
button {
	@apply bg-stone-700 hover:bg-stone-600 w-12 grid place-content-center rounded p-1
}
select {
	@apply bg-stone-700 w-96 rounded text-stone-200 p-1 text-lg text-center
}
</style>
