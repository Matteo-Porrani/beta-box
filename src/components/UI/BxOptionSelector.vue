<template>
	<div class="option-selector border border-stone-600 flex gap-4 w-fit rounded p-1">

		<button @click="stepByOne(0)">
			<BxIcon icon="caret_left"/>
		</button>

		<select v-model="selectedValue">
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
</template>


<script>
import BxIcon from "@/components/UI/BxIcon.vue";

export default {

	name: "BxOptionSelector",
	components: { BxIcon },

	props: {
		selectOptions: {
			type: Array,
			default: () => []
		},
		initValue: {
			type: [String, Number, null],
			default: null,
		}
	},

	emits: ["optionSelected"],

	data() {
		return {
			selectedValue: null,
		}
	},

	watch: {
		selectedValue(newId) {
			this.$emit("optionSelected", newId);
		}
	},

	mounted() {
		if (this.initValue) this.selectedValue = this.initValue;
	},

	methods: {
		stepByOne(dir) { 	// 0 is prev - 1 is next
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
button,
select {
	@apply bg-stone-700 rounded p-1
}

button {
	@apply w-12 grid place-content-center hover:bg-stone-600
}

select {
	@apply w-72 text-stone-200 text-lg text-center
}
</style>
