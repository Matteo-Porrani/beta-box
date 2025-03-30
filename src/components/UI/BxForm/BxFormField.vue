<template>
	<div
		data-test="bx-form-field-root"
		class="grid grid-cols-[1fr_4fr] items-center border border-stone-500 rounded p-1"
	>
		<label class="text-sm">
			{{ fieldDesc.field }}
			<span v-if="fieldDesc.required">*</span>
		</label>

		<!--	EVERY INPUT TYPE MUST BE ISOLATED IN SPECIFIC COMPONENT	-->

		<template v-if="fieldDesc.type === 'T'">
			<input
				type="text"
				class="w-full"
				:readonly="fieldDesc.readonly"
				v-model="value"
			>
		</template>

		<template v-if="fieldDesc.type === 'N'">
			<input
				type="number"
				class="w-24"
				:readonly="fieldDesc.readonly"
				v-model="value"
			>
		</template>

		<template v-if="fieldDesc.type === 'B'">
			<BxSwitch v-model="value" />
		</template>

		<template v-if="fieldDesc.type === 'L'">
			<select v-model="value">
				<option
					v-for="o in options"
					:key="o.value"
					:value="o.value"
				>
					{{ o.label }}
				</option>
			</select>
		</template>

		<template v-if="fieldDesc.type === 'D'">
			<div class="flex gap-1">
				<input
					v-model="dateTimeValue.date"
					type="date"
					class="block w-32 text-xl text-stone-800 bg-stone-400 rounded p-1"
				>
				<input
					v-model="dateTimeValue.time"
					type="time"
					class="block w-32 text-xl text-stone-800 bg-stone-400 rounded p-1"
				>
			</div>
		</template>

		<template v-if="fieldDesc.type === 'E'">
			<EntityPicker
				ref="entity_picker_ref"
				:entity="fieldDesc.rel_entity"
				:multiple="fieldDesc.multiple"
				@update:model-value="newValue => value = newValue"
			/>
		</template>

	</div>
</template>


<script>
import { defineComponent } from 'vue'
import { mapGetters, mapMutations, mapState } from "vuex";
import BxSwitch from './fields/BxSwitch.vue';
import EntityPicker from "@/components/UI/BxForm/fields/EntityPicker.vue";

export default defineComponent({
	name: "BxFormField",

	components: {
		EntityPicker,
		BxSwitch
	},

	props: {
		fieldDesc: {
			type: Object,
			required: true,
		},
	},

	expose: ["initField"],

	data() {
		return {
			value: null,
			dateTimeValue: {
				date: null,
				time: "00:00"
			}
		}
	},

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
		}),
		...mapGetters("entity", ["getList"]),

		options() {
			return this.fieldDesc.type === "L"
				? this.getList(this.fieldDesc.list)
				: []; // avoid calling getList() if it's not a list type
		}
	},

	watch: {
		value(newVal) {
			this.SET_FIELD({
				key: this.fieldDesc.field,
				value: newVal,
			})
		},

		/**
		 * If the field is a list and the value is not set, set the default value
		 */
		options: {
			immediate: true,
			handler(newOptions) {
				if (this.fieldDesc.type === 'L' && !this.value) {
					const defaultOption = newOptions?.find(o => o.default === true);
					if (defaultOption) {
						this.value = defaultOption.value;
					}
				}
			}
		},

		dateTimeValue: {
			deep: true,
			handler: function (newVal) {
				this.SET_FIELD({
					key: this.fieldDesc.field,
					value: `${newVal.date}@${newVal.time}`,
				})
			}
		},
	},

	methods: {
		...mapMutations("form", ["SET_FIELD"]),

		initField(initVal) {

			if (this.fieldDesc.type === "D") {
				const [date, time] = initVal !== null
					? initVal.split("@")
					: [null, "00:00"];
				this.dateTimeValue = {
					date,
					time,
				}
				return;
			}

			if (this.fieldDesc.type === "B") {
				this.value = initVal ?? false;
				return;
			}

			if (this.fieldDesc.type === "E") {
				console.log("case E", initVal)
				this.$refs.entity_picker_ref.setValue(initVal);
				return;
			}

			this.value = initVal;
		}
	}

})
</script>


<style scoped>
input,
select {
	@apply bg-stone-700 rounded text-stone-200 p-1 text-xl
}

input[readonly] {
	@apply bg-stone-800 text-stone-200
}
</style>

