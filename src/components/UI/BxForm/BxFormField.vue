<template>
	<div
		data-test="bx-form-field-root"
		class="grid grid-cols-[1fr_4fr] items-center border border-stone-500 rounded p-1"
	>
		<label class="text-sm">
			{{ fieldDesc.field }}
			<span v-if="fieldDesc.required">*</span>
		</label>

		<template v-if="fieldDesc.type === 'T'">
			<input
				type="text"
				class="w-full"
				:readonly="fieldDesc.readonly"
				v-model="value"
			>
		</template>

		<template v-if="fieldDesc.type === 'TA'">
			<textarea
				class="w-full h-24"
				:readonly="fieldDesc.readonly"
				v-model="value"
			></textarea>
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

		<template v-if="fieldDesc.type === 'D'">
			<div class="flex gap-1">
				<input
					v-model="dateTimeValue.date"
					type="date"
					class="block w-48 text-xl text-stone-800 bg-stone-400 rounded p-1"
				>
				<input
					v-model="dateTimeValue.time"
					type="time"
					class="block w-48 text-xl text-stone-800 bg-stone-400 rounded p-1"
				>
			</div>
		</template>

		<!--	##################################################################	-->

		<template v-if="fieldDesc.type === 'L'">
			<select v-model="value">
				<option
					v-for="o in fieldDesc.options"
					:key="o.value"
					:value="o.value"
				>
					{{ o.label }}
				</option>
			</select>
		</template>

		<template v-if="fieldDesc.type === 'E'">
			<EntityPicker
				ref="entity_picker_ref"
				:field-desc="fieldDesc"
				:entity="fieldDesc.rel_entity"
				:multiple="fieldDesc.multiple"
				@update:model-value="newValue => value = newValue"
			/>
		</template>

	</div>
</template>


<script>
// Vue related
import { defineComponent } from 'vue'
// utils
import { isFalsy, nrm } from "@/utils/core-utils";
// components
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

	emits: ["valueChanged"],
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
		options() {
			return this.fieldDesc.type === "L"
				? this.fieldDesc.options
				: []; // avoid calling getList() if it's not a list type
		}
	},

	watch: {
		value(newVal) {
			const changeData = {
				key: this.fieldDesc.field,
				value: newVal
			}
			this.$emit("valueChanged", changeData)
		},

		/**
		 * If the field is a list and the value is not set, set the default value
		 */
		options: {
			immediate: true,
			handler(newOptions) {
				// console.log('newOptions', nrm(newOptions))
				if (this.fieldDesc.type === 'L' && !this.value) {
					const defaultOption = newOptions?.find(o => o.default === true);
					// console.log("set value to", defaultOption.value)
					if (defaultOption) this.value = defaultOption.value;
				}
			}
		},

		dateTimeValue: {
			deep: true,
			handler: function (newVal) {
				this.$emit("valueChanged", {
					key: this.fieldDesc.field,
					value: `${newVal.date}@${newVal.time}`,
				})
			}
		},
	},

	methods: {
		initField(initVal) {
			let date, time;
			switch (this.fieldDesc.type) {
				case "B":
					this.value = initVal ?? false;
					break;
				case "D":
					[date, time] = !isFalsy(initVal)
						? initVal.split("@")
						: [null, "00:00"];
					this.dateTimeValue = { date, time };
					break;
				case "E":
					this.$refs.entity_picker_ref.setValue(initVal);
					break;
				default:
					// console.log("field initVal", initVal)
					this.value = initVal;
			}
		}
	}

})
</script>


<style scoped>
input,
textarea,
select {
	@apply bg-stone-700 rounded text-stone-200 p-1 text-xl
}

input[readonly] {
	@apply bg-stone-800 text-stone-200
}

/*
textarea {
	@apply text-sm
}
 */
</style>

