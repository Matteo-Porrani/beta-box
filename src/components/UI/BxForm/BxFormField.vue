<template>
	<div
		data-test="bx-form-field-root"
		class="grid grid-cols-[1fr_4fr] items-center border rounded p-1"
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
			<label class="inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					class="sr-only peer"
					v-model="value"
				>
				<div
					class="
						relative w-11 h-6 rounded-full
						peer bg-stone-700
						peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
						peer-checked:after:border-white
						after:content-[''] after:absolute after:top-[2px] after:start-[2px]
						after:bg-stone-300 after:rounded-full
						after:size-5 after:transition-all peer-checked:bg-teal-500"/>
			</label>
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

	</div>
</template>


<script>
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from "vuex";

export default defineComponent({
	name: "BxFormField",

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
		...mapGetters("list", ["getList"]),

		options() {
			return this.getList(this.fieldDesc.list);
		}
	},

	watch: {
		value(newVal) {
			this.SET_FIELD({
				key: this.fieldDesc.field,
				value: newVal,
			})
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
			this.value = initVal;
		}
	}

})
</script>


<style scoped>
input,
select {
	@apply bg-stone-700 rounded text-stone-200 p-1 text-sm
}

input[readonly] {
	@apply bg-stone-800 text-stone-200
}
</style>

