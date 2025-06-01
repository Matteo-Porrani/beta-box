<template>
	<div class="bg-violet-800">

		<BxButton
			label="Cancel"
			@click="$emit('discardInnerSelection')"
		/>

	</div>
</template>


<script setup>
import { ref, computed, defineEmits } from 'vue';

const $emit = defineEmits(["discardInnerSelection"])

</script>

