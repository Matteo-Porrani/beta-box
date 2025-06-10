<!--

PROPS
- steps - Object[]

-->


<template>
	<div class="border rounded p-1 flex flex-col gap-2">

		<section
			v-for="sec in sections"
			:key="sec.sectionCode"
			class="mb-4"
		>
			<h2 class="text-xl font-bold mb-2">{{ sec.sectionCode }}</h2>

			<div class="space-y-2">
				<BxStepTrackerItem
					v-for="step in sec.steps"
					:key="step"
					:step-item="step"
					@step-clicked="onStepClicked"
				/>
			</div>

		</section>


	</div>
</template>


<script setup>
import { ref, reactive, computed, defineProps, defineEmits } from 'vue';
import BxStepTrackerItem from "@/modules/ui/components/BxStepTracker/BxStepTrackerItem.vue";

const $p = defineProps({
	steps: Array,
	default: () => [],
})

const $emit = defineEmits(["stepClicked"])


const sections = computed(() => {
	const sectionsObject = $p.steps.reduce((acc, item) => {
		if (!acc[item.sectionCode]) acc[item.sectionCode] = [];
		acc[item.sectionCode].push(item)
		return acc;
	}, {})

	return Object.entries(sectionsObject).reduce((acc, [sectionCode, steps]) => {
		acc.push({ sectionCode, steps })
		return acc;
	}, [])
})



function onStepClicked(stepItem) {
	console.log("____onStepClicked", stepItem)
	$emit("stepClicked", stepItem)
}
</script>


