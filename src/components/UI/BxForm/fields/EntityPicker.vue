<template>

	<div class="flex gap-2">

		<input type="text">

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
						class="size-8"
						v-model="values[r.id]"
					>
					<p>{{ r.id }}</p>
					<p>{{ r.name }}</p>
				</div>
			</div>
		</template>
	</BxModal>
</template>


<script>
import BxModal from "@/components/UI/BxModal.vue";
import BxIcon from "@/components/UI/BxIcon.vue";
import { mapGetters, mapState } from "vuex";
import { nrm, pascalToSnake } from "@/utils/core-utils";
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
	},

	data() {
		return {
			values: {

			},

			mockCols: ["id", "name"],
			mockRows: [
				{ id: 1, name: "Hello" },
				{ id: 2, name: "World" },
			]
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
		}
	},

	mounted() {
		this.initBinding();
	},

	methods: {

		initBinding() {
			for (const r of this.rows) {
				this.values[r.id] = false;
			}
		},

		openModal() {
			this.$refs.modal_ref.open();
		}

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

