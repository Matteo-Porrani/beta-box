<template>
	<div
		class="w-[450px] rounded border border-stone-500 bg-stone-800 p-1"
	>

<!--		<pre>timeValue : {{ timeValue }}</pre>-->
<!--		<pre>model : {{ model }}</pre>-->

		<div class="flex items-center justify-between">
			<select
				class="text-xs bg-stone-500 rounded w-12 p-1"
				v-model="frequence"
			>
				<option
					v-for="o in [5, 10, 15, 20]"
					:key="o"
					:value="o"
				>
					{{ o }}
				</option>
			</select>


			<BxButton
				label="OK"
				size="small"
				type="soft"
				@click="$emit('closeTimePicker')"
			/>
		</div>



		<div class="h-2"/>

		<div class="hours-section grid grid-cols-6 gap-1 ">
			<BxButton
				v-for="opt in hourOpts"
				:key="opt.value"
				:label="opt.label"
				type="soft"
				size="small"
				no-min-width
				@click="updateValue('$H', opt.value)"
			/>
		</div>
		<div class="h-4"/>
		<div
			v-if="minOpts"
			class="minutes-section grid grid-cols-6 gap-1"
		>
			<BxButton
				v-for="opt in minOpts"
				:key="opt"
				:label="opt.label"
				type="soft"
				size="small"
				no-min-width
				@click="updateValue('$M', opt.value)"
			/>
		</div>

	</div>
</template>


<script setup>
import { ref, reactive, computed, defineProps, defineModel, defineEmits, watch } from 'vue'


const model = defineModel();
const $p = defineProps({
	range: { type: Number, default: 24 },
})

const $emit = defineEmits(["closeTimePicker"])

const computedValue = computed(() => `${timeValue.$H}:${timeValue.$M}`)
const timeValue = reactive({
  hour: null,
  min: null,
})


const frequence = ref("15"); // default
const hourOpts = computed(() => _buildOpts($p.range, (v => v)))
const minOpts = computed(() => _buildOpts((60 / frequence.value), (v => v * frequence.value)))

watch(
	() => model.value,
	(newVal) => {
		if (!newVal) return;
		const [h, m] = newVal.split(":");
		timeValue.$H = h;
		timeValue.$M = m;
	},
	{ immediate: true }
)


// =============================================
function updateValue(key, v) {
	v = adjustValue(v);
	timeValue[key] = v;
	model.value = computedValue.value;
}


// =============================================
// UTILITY

function adjustValue(v) {
	return (v < 10 ? `0${v}` : v).toString();
}

function _buildOpts(optsCount, valueCb) {
	const idxs = [...new Array(optsCount).keys()]
	return idxs.reduce((acc, item) => {
		const opt = {
			value: valueCb(item),
			label: valueCb(item)
		}
		acc.push(opt);
		return acc;
	}, [])
}

</script>


