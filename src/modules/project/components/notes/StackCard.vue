<template>
	<article
		class="bg-stone-700 rounded p-1 h-32"
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
					class="hover:text-sky-500"
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

		<div class="h-4"/>

		<p
			:title="ticket.description"
			class="text-xs bg-stone-600 h-10 rounded p-1"
		>
			{{ cmpDescription }}
		</p>

		<div class="h-2"/>

		<div class="flex justify-between text-sm">
			<p>{{ ticket.topic?.name }}</p>
			<p>{{ ticket.team }}</p>
		</div>

	</article>
</template>


<script setup>
import { defineEmits, defineProps, computed } from 'vue'

const $p = defineProps({
	ticket: Object
})

const cmpDescription = computed(() => {
	return $p.ticket.description?.length > 80
		? $p.ticket.description.slice(0, 80) + "..."
		: $p.ticket.description;
})

const $emit = defineEmits(["editTicket", "openDetail"])
</script>

