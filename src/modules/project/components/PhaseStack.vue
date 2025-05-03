<template>
	<article
		class="grid grid-rows-[auto_1fr] border border-stone-500 rounded p-1 overflow-y-hidden"
	>
		<h2 class="text-center text-xl font-bold">{{ phase }}</h2>

		<div class="space-y-2 bx-scrollbar">
			<StackCard
				v-for="t in stack"
				:key="t.id"
				:ticket="t"
				@edit-ticket="onEditTicket"
				@open-detail="onOpenDetail"
			/>
		</div>

	</article>
</template>


<script setup>
import { defineProps, defineEmits } from 'vue'
import StackCard from "@/modules/project/components/notes/StackCard.vue";


defineProps({
	phase: String,
	stack: Array,
})

const $emit = defineEmits(["editTicket", "openDetail"])


function onEditTicket(id) {
	$emit('editTicket', id)
}

function onOpenDetail(id) {
	$emit('openDetail', id)
}

</script>

