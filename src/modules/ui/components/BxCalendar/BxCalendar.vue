<template>
	<div>
		<pre>innerSelection: {{ innerSelection }}</pre>
		<pre>innerMode: {{ innerMode }}</pre>
	</div>

	<div class="grid gap-1 grid-rows-[auto_1fr] bg-blue-800 w-[512px] h-96 p-1">

		<BxCalendarNav
			@selection-change="onSelectionChange"
		/>

		<BxCalendarInnerSelector
			v-if="innerSelection"
			@discard-inner-selection="restoreDefault"
		/>

		<BxCalendarBody
			v-else
		/>

	</div>
</template>


<script setup>
import { ref, computed } from 'vue';
import BxCalendarNav from "@/modules/ui/components/BxCalendar/BxCalendarNav.vue";
import BxCalendarBody from "@/modules/ui/components/BxCalendar/BxCalendarBody.vue";
import BxCalendarInnerSelector from "@/modules/ui/components/BxCalendar/BxCalendarInnerSelector.vue";


const innerSelection = ref(false);
const innerMode = ref(null);



function restoreDefault() {
	innerSelection.value = false;
	innerMode.value = null;
}

function openInnerSelection({ mode = "$M" }) {
	innerSelection.value = true;
	innerMode.value = mode;
}

function onSelectionChange(mode) {
	console.log("+++++ onSelectionChange", mode)
	openInnerSelection({ mode })
}



</script>
