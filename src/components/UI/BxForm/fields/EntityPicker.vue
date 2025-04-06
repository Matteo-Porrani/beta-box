<template>
	<div class="flex gap-2">
		<input
			type="text"
			readonly
			v-model="parsedValue"
		>
		<button @click="openModal">
			<BxIcon icon="bars"/>
		</button>
		<button @click="reset" class="text-stone-500">
			<BxIcon icon="xmark"/>
		</button>
	</div>
	<!-- MODAL -->
	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<h2 class="text-2xl font-bold">{{ entity }}</h2>
			<p>MULTI : {{ multiple ? 'TRUE' : 'FALSE' }}</p>
		</template>
		<template #body>
			<div class="space-y-2">
				<div
					class="grid gap-2 bg-stone-800 font-bold rounded p-1"
					:class="gridColsClass"
				>
					<div></div>
					<div
						v-for="c in cols"
						:key="c"
					>{{ c }}</div>
				</div>
				<div
					v-for="r in rows"
					:key="r.id"
					class="grid gap-2 border border-stone-500 rounded p-1"
					:class="gridColsClass"
				>
					<input
						type="checkbox"
						class="size-8 accent-lime-600"
						v-model="values[r.id]"
						:data-id="r.id"
						@change="onCheckboxChange"
					>
					<p
						v-for="c in cols"
						:key="c"
					>
						{{ r[c] }}
					</p>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="w-full flex justify-between">
				<button
					class="
						w-32 bg-stone-800 border border-stone-500 text-stone-500 hover:bg-stone-900
						disabled:hover:cursor-not-allowed rounded py-2 px-6
					"
					@click="$refs.modal_ref.close"
				>
					Cancel
				</button>
				<button
					class="
						w-32 bg-lime-600 border border-lime-600 hover:bg-lime-500
						disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800
					"
					@click="submitValue"
				>
					Ok
				</button>
			</div>
		</template>
	</BxModal>
</template>


<script>
// utils
import { isFalsy } from "@/utils/core-utils";
// components
import BxModal from "@/components/UI/BxModal.vue";
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "EntityPicker",

	components: {
		BxIcon,
		BxModal
	},

	props: {
		fieldDesc: Object,
		entity: String,
		multiple: Boolean,
	},

	emits: ["update:modelValue"],

	expose: ["setValue", "reset"],

	data() {
		return {
			values: {},
		}
	},

	computed: {
		cols() {
			return this.fieldDesc.entityPickerCols;
		},

		rows() {
			return this.fieldDesc.options;
		},

		parsedValue() {
			const pv = Object.keys(this.values).reduce((acc, key) => {
				if (this.values[key] === true) acc.push(key);
				return acc;
			}, []);
			return pv.join(":");
		},

		gridColsClass() {
			return `grid-cols-${this.cols.length + 1}`;
		},

	},

	mounted() {
		this.initBinding();
	},

	methods: {

		// =============================================
		// INIT
		// =============================================

		initBinding() {
			for (const r of this.rows) {
				this.values[r.id] = false;
			}
		},

		reset() {
			this.setAllValuesToFalse();
			this.$emit("update:modelValue", "");
		},

		setValue(value) {
			console.log("EP value", value)
			if (isFalsy(value)) return;
			for (const key of value.split(":")) {
				this.values[key] = true;
			}
			this.$emit("update:modelValue", this.parsedValue)
		},

		// =============================================
		// VALUE HANDLING & SUBMIT
		// =============================================

		onCheckboxChange(event) {
			const lastSelectedId = event.target.dataset.id;
			if (!this.multiple) {
				this.setAllValuesToFalse();
				this.values[lastSelectedId] = true;
			}
		},

		setAllValuesToFalse() {
			for (const k of Object.keys(this.values)) {
				this.values[k] = false;
			}
		},

		submitValue() {
			this.$emit("update:modelValue", this.parsedValue)
			this.$refs.modal_ref.close();
		},

		// =============================================
		// MISC
		// =============================================

		openModal() {
			this.$refs.modal_ref.open();
		},
	}
}
</script>


<style scoped>
input,
select {
	@apply bg-stone-700 rounded text-stone-200 p-1 text-xl
}

input[readonly] {
	@apply bg-stone-800 text-stone-200
}
/*
grid-cols-2
grid-cols-3
grid-cols-4
grid-cols-5
grid-cols-6
*/
</style>

