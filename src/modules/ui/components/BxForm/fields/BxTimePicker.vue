<template>
	<div
		class="w-[450px] rounded border border-stone-500 bg-stone-800 p-1"
	>
		<div class="hours-section grid grid-cols-6 gap-1 ">
			<BxButton
				v-for="opt in hourOpts"
				:key="opt.value"
				:label="opt.label"
				:type="itemButtonType('$H', opt.value)"
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
				:type="itemButtonType('$M', opt.value)"
				size="small"
				no-min-width
				@click="updateValue('$M', opt.value)"
			/>
		</div>

		<div class="h-6"/>
		<div class="flex items-center justify-between">
			<select
				class="w-16 text-xs bg-stone-500 rounded p-1"
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
				class="w-24"
				@click="$emit('closeTimePicker')"
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

const $emit = defineEmits(["timePicked", "closeTimePicker"])

const computedValue = computed(() => `${timeValue.$H}:${timeValue.$M}`)
const timeValue = reactive({
  $H: null,
  $M: null,
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
	$emit("timePicked")
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

function itemIsCurrent(key, item) {
	return parseInt(timeValue[key]) === parseInt(item);
}

function itemButtonType(key, item) {
	return itemIsCurrent(key, item) ? "primary" : "soft";
}

</script>


