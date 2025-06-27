<template>
	<article
		class="bg-stone-700 rounded p-1 h-28"
	>
		<div class="flex justify-between items-center">
			<div class="flex">
				<BxIconButton
					text
					icon="card_id"
					no-min-width
					@click="$emit('openDetail', ticket.id)"
				/>
				<button
					class="font-bold hover:text-sky-500"
					@click="$emit('editTicket', ticket.id)"
				>
					{{ ticket.title }}
				</button>
			</div>
			<BxBadge
				v-if="ticket.status"
				size="small"
				:label="ticket.status.name"
				:color="ticket.status.color.name"
				:shade="ticket.status.color.shade"
			/>
		</div>


		<p class="text-xs text-stone-400 px-1">{{ subtitle }}</p>
		<div class="h-1"/>

		<p
			:title="ticket.description"
			class="text-sm h-10 px-1"
		>
			{{ cmpDescription }}
		</p>

<!--		<div class="flex justify-end items-center">-->
<!--			<p-->
<!--				v-if="ticket.topic"-->
<!--				class="text-xs bg-stone-600 rounded py-1 px-2"-->
<!--			>{{ ticket.topic?.name }}</p>-->
<!--		</div>-->

	</article>
</template>


<script setup>
import { defineEmits, defineProps, computed } from 'vue'

const $p = defineProps({
	ticket: Object
})
const subtitle = computed(() => {
	const bits = [];
	if ($p.ticket.team) bits.push($p.ticket.team);
	if ($p.ticket.topic) bits.push($p.ticket.topic.name);
	return bits.join(" - ");
})

const cmpDescription = computed(() => {
	return $p.ticket.description?.length > 64
		? $p.ticket.description.slice(0, 64) + "..."
		: $p.ticket.description;
})

const $emit = defineEmits(["editTicket", "openDetail"])
</script>

