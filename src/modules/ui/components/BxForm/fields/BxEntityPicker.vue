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
			<h2 class="text-lg font-bold">{{ entity }}</h2>
		</template>
		<template #body>

			<div class="text-center">
				<input type="text" v-model="needle">
			</div>

			<div class="h-2"/>

			<div class="space-y-1">

				<!-- HEADER ROW -->
				<section
					class="grid items-center bg-stone-800 font-bold rounded p-1"
					:class="gridColsClass"
				>
					<div data-field="id"/>
					<div
						v-for="c in cols"
						:key="c"
						:data-field="c"
					>{{ c }}</div>
				</section>

				<!-- NORMAL ROWS -->
				<section
					v-for="r in rows"
					:key="r.id"
					class="grid items-center border border-stone-500 rounded p-1"
					:class="gridColsClass"
				>
					<div data-field="id" class="grid">
						<input
							type="checkbox"
							class="size-8 accent-lime-600"
							v-model="values[r.id]"
							:data-id="r.id"
							@change="onCheckboxChange"
						>
					</div>

					<p
						v-for="c in cols"
						:key="c"
						:data-field="c"
						class="max-w-72 overflow-x-hidden overflow-ellipsis text-nowrap"
					>
						{{ r[c] }}
					</p>
				</section>
			</div>
		</template>
		<template #footer>
			<div class="w-full flex justify-between">
				<BxButton
					type="soft"
					label="Cancel"
					@click="$refs.modal_ref.close"
				/>
				<BxButton
					label="Ok"
					@click="submitValue"
				/>
			</div>
		</template>
	</BxModal>
</template>


<script>
// utils
import { isFalsy, nrm } from "@/modules/core/utils/core-utils";
import { filterTableByNeedle } from "@/modules/core/utils/table-utils";

export default {
	name: "BxEntityPicker",

	props: {
		fieldDesc: Object,
		entity: String,
		multiple: Boolean,
	},

	emits: ["update:modelValue"],

	expose: ["setValue", "reset"],

	data() {
		return {
			needle: "",
			values: {},
		}
	},

	computed: {
		cols() {
			return this.fieldDesc.entityPickerCols;
		},

		rows() {
			return filterTableByNeedle(nrm(this.fieldDesc.options), this.needle)
		},

		parsedValue() {
			const pv = Object.keys(this.values).reduce((acc, key) => {
				if (this.values[key] === true) acc.push(key);
				return acc;
			}, []);
			return pv.join(":");
		},

		gridColsClass() {
			let t = "";
			for (let i = 1; i <= (this.cols.length - 1); i++) {
				t += "_1fr";
			}
			return `grid-cols-[80px_100px${t}]`;
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
	@apply bg-stone-700 rounded text-stone-200 p-1 text-lg
}

input[readonly] {
	@apply bg-stone-800 text-stone-200
}

[data-field="id"] {
	width: 60px;
}
/*
grid-cols-[80px_100px_1fr]
grid-cols-[80px_100px_1fr_1fr]
grid-cols-[80px_100px_1fr_1fr_1fr]
*/
</style>

