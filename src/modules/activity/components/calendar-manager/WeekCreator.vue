<template>
	<div class="rounded space-y-2 bg-stone-900 p-1">
		<BxButton
			type="soft"
			label="Cancel"
			@click="$emit('close')"
		/>

		<BxFormField
			:field-desc="{ field: 'start', type: 'D' }"
			@value-changed="onValueChange"
		/>
		<BxFormField
			:field-desc="{ field: 'end', type: 'D' }"
			@value-changed="onValueChange"
		/>

		<pre>{{ values }}</pre>


		<BxButton
			v-if="formIsValid"
			label="Generate week"
			@click="generateWeek"
		/>

	</div>
</template>


<script setup>

import { ref, reactive, computed, defineEmits } from 'vue'
import { nrm } from "@/modules/core/utils/core-utils";

const $emit = defineEmits(["close", "daysSelected"]);

const values = reactive({});

function onValueChange(payload) {
	const { key, value } = payload;
	values[key] = value;
}

const formIsValid = computed(() => Object.keys(values).length === 2)

function generateWeek() {
	$emit("daysSelected", nrm(values))
	$emit("close")
}

</script>

