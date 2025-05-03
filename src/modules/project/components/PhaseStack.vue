<template>
	<article
		class="grid grid-rows-[auto_1fr] border border-stone-500 rounded p-1 overflow-y-hidden"
	>
		<h2 class="text-center text-xl font-bold">{{ phase }}</h2>

		<div class="space-y-1 bx-scrollbar">
			<StackCard
				v-for="t in sortedTickets"
				:key="t.id"
				:ticket="t"
				@edit-ticket="onEditTicket"
				@open-detail="onOpenDetail"
			/>
		</div>

	</article>
</template>


<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import StackCard from "@/modules/project/components/notes/StackCard.vue";


const $p = defineProps({
	phase: String,
	stack: Array,
})

const $emit = defineEmits(["editTicket", "openDetail"])

const sortedTickets = computed(() => {
	if (!$p.stack) return [];

	const rawTickets = $p.stack.map(t => {
		t.status_name = (t.status) ? t.status.name : "";
		return t;
	})

	const topTickets = rawTickets.filter(t => t.status_name);
	topTickets.sort((a, b) => a.status_name.localeCompare(b.status_name))
	const bottomTickets = rawTickets.filter(t => t.status_name === "");

	return [...topTickets, ...bottomTickets];
})

function onEditTicket(id) {
	$emit('editTicket', id)
}

function onOpenDetail(id) {
	$emit('openDetail', id)
}

</script>

