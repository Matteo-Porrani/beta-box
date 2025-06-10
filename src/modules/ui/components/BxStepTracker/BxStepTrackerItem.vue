<template>
	<div
		class="border border-stone-500 rounded p-1 grid grid-cols-8 cursor-pointer hover:border-yellow-400"
		:class="bgClass"
		@click="emitStepClicked"
	>

		<p>{{ stepItem.index }}</p>
		<p class="col-span-3">{{ stepItem.label }}</p>

		<span></span>
		<span class="col-span-2"></span>


		<div class="flex justify-end">
			<BxIcon
				:icon="currentIcon.icon"
				:class="currentIcon.class"
			/>
		</div>



	</div>
</template>


<script setup>
import { ref, reactive, computed, defineProps, defineEmits } from 'vue';

const STATUS_ICONS = {
	UNVISITED: {
		icon: "",
		class: "",
	},
	SUCCESS: {
		icon: "success",
		class: "text-emerald-400",
	},
	ERROR: {
		icon: "xmark",
		class: "text-pink-600",
	},
}

const BG_CLASSES = {
	CURRENT: "bg-sky-800",
	SUCCESS: "bg-emerald-900",
	ERROR: "bg-pink-950",
}

const $p = defineProps({
	stepItem: {
		type: Object,
		required: true,
	}
})

const $emit = defineEmits(["stepClicked"])

const bgClass = computed(() => {
	if ($p.stepItem.current) return BG_CLASSES.CURRENT;

	if ($p.stepItem.visited) {
		if ($p.stepItem.error) {
			return BG_CLASSES.ERROR;
		} else {
			return BG_CLASSES.SUCCESS;
		}
	}

	return "bg-transparent"
})
const currentIcon = computed(() => {
	if (!$p.stepItem.visited || $p.stepItem.current) return STATUS_ICONS.UNVISITED;

	if ($p.stepItem.visited) {
		if ($p.stepItem.error) {
			return STATUS_ICONS.ERROR;
		} else {
			return STATUS_ICONS.SUCCESS;
		}
	}

	return "bg-transparent"
})


function emitStepClicked() {
	$emit("stepClicked", $p.stepItem)
}

</script>


