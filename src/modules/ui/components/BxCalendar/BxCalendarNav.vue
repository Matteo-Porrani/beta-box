<template>
	<div class="bg-orange-800 flex gap-2 justify-between">
		<BxIconButton
			icon="angle_left"
			type="soft"
			class="w-8"
		/>

		<BxButton
			text
			label="Month"
			@click="emitSelectionChange('$M')"
		/>
		<BxButton
			text
			label="Year"
			@click="emitSelectionChange('$Y')"
		/>

		<BxIconButton
			icon="angle_right"
			type="soft"
			class="w-8"
		/>
	</div>
</template>


<script setup>
import { ref, computed, defineEmits } from 'vue';

const $emit = defineEmits(["selectionChange"])

function emitSelectionChange(mode) {
	$emit("selectionChange", mode)
}

</script>
