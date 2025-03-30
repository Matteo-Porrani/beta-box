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
		<pre class="text-sm">{{ entity }}</pre>
	</div>

	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<p>{{ entity }}</p>
			<p>MULTI : {{ multiple ? 'TRUE' : 'FALSE' }}</p>
		</template>


		<template #body>
			<div class="space-y-2">
				<div
					class="grid gap-2 border rounded p-1"
					:class="gridColsClass"
				>
					<div></div>
					<div
						v-for="c in getCols"
						:key="c"
					>{{ c }}</div>
				</div>

				<div
					v-for="r in rows"
					:key="r.id"
					class="grid gap-2 border rounded p-1"
					:class="gridColsClass"
				>
					<input
						type="checkbox"
						class="size-8 accent-lime-600"
						v-model="values[r.id]"
					>
					<p>{{ r.id }}</p>
					<p>{{ r.name }}</p>
				</div>
			</div>
		</template>

		<template #footer>

			<div class="w-full flex justify-between">
				<button @click="$refs.modal_ref.close">Close</button>
				<button @click="submitValue">OK</button>
			</div>
		</template>
	</BxModal>
</template>


<script>
import BxModal from "@/components/UI/BxModal.vue";
import BxIcon from "@/components/UI/BxIcon.vue";
import { mapGetters, mapState } from "vuex";
import { isFalsy, nrm, pascalToSnake } from "@/utils/core-utils";
import { getPickerColsFromDef } from "@/utils/entity-utils";

export default {
	name: "EntityPicker",

	components: {
		BxIcon,
		BxModal
	},

	props: {
		entity: String,
		multiple: Boolean,
		modelValue: [String, Number]
	},

	emits: ["update:modelValue"],

	expose: ["setValue"],

	data() {
		return {
			values: {},
		}
	},

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
		}),

		...mapGetters("entity", [
			"getEntityDescription",
		]),

		rows() {
			const snakeRelEntityName = pascalToSnake(this.entity);
			return this.entities[snakeRelEntityName] ?? [];
		},

		// get the definition of the entity, with 'picker_col' value
		getCols() {
			let d = this.getEntityDescription(this.entity);
			d = nrm(d);
			return getPickerColsFromDef(d);
		},

		// =============================================
		// UTILITIES
		// =============================================

		gridColsClass() {
			return `grid-cols-${this.getCols.length + 1}`;
		},

		parsedValue() {
			const parsedValue = Object.keys(this.values).reduce((acc, key) => {
				if (this.values[key] === true) {
					acc.push(key);
				}
				return acc;
			}, []);
			return parsedValue.join(":");
		}
	},

	mounted() {
		this.initBinding();
		this.initValue();
	},

	methods: {
		initValue() {
			console.log("+++ initValue", "modelValue", this.props)
		},

		initBinding() {
			for (const r of this.rows) {
				this.values[r.id] = false;
			}
		},

		setValue(value) {
			console.log("+++ setValue", value)
			if (isFalsy(value)) return;
			this.values[value] = true;
		},

		openModal() {
			this.$refs.modal_ref.open();
		},

		submitValue() {
			this.$emit("update:modelValue", this.parsedValue)

			this.$refs.modal_ref.close();
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
*/
</style>

