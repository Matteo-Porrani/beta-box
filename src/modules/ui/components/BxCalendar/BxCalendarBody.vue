<template>
	<div class="calendar-grid text-sm">

		<!-- Days of week header -->
		<div class="calendar-row grid grid-cols-7 gap-2 p-1">
			<article
				v-for="d in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
				:key="d[0]"
				class="text-center font-bold text-stone-500 rounded p-1"
			>
				<p>{{ d }}</p>
			</article>
		</div>

		<!-- Calendar days grid -->
		<div
			v-for="r in rows"
			:key="r[0]"
			class="calendar-row grid grid-cols-7 gap-2 p-1"
		>
			<!-- Individual day cells -->
			<article
				v-for="d in r"
				:key="d[0]"
				class="text-center rounded has-[.text-yellow-500]:border-2 has-[.text-yellow-500]:border-yellow-500 py-1"
				:class="d.isPadding ? 'bg-stone-900' : 'bg-stone-600'"
			>
				<p :class="{'font-bold text-yellow-500' : d.isToday}">{{ d.date.split("-").at(2) }}</p>
			</article>
		</div>
	</div></template>


<script setup>
import { ref, computed, defineProps } from 'vue';

defineProps({
	rows: {
		type: Array,
		required: true,
	}
})

</script>
