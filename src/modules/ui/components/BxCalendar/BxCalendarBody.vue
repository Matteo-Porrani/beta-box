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
			<button
				v-for="d in r"
				:key="d[0]"
				class="text-center rounded border-2 has-[.text-yellow-500]:border-yellow-500 py-1"
				:class="dayDynamicClasses(d)"
				@click="onDayClick(d.date)"
			>
				<span>{{ d.date.split("-").at(2) }}</span>
			</button>
		</div>
	</div></template>


<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const $p = defineProps({
	rows: {
		type: Array,
		required: true,
	},
	selectedDay: { type: String, required: true }
})

const $emit = defineEmits(["dayClicked"]);

function onDayClick(strDate) {
	$emit("dayClicked", strDate)
}


const dayDynamicClasses = computed(() => {
	return (day) => {
		const c = ["border-transparent"];

		if (day.isToday) c.splice(0, 1, "border-yellow-500")

		if (day.date === $p.selectedDay) {
			c.push("bg-sky-500")
		} else {
			if (day.isPadding) {
				c.push("bg-stone-900")
			} else {
				c.push("bg-stone-600")
			}
		}
		return c.join(" ");
	}
})

</script>
