<template>
	<article
		class="bg-stone-700 rounded p-1 h-32"
	>
		<div class="flex justify-between items-center">

			<div class="flex">
				<BxIconButton
					class="w-10"
					size="small"
					text
					icon="card_id"
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

		<p
			class="text-xs bg-stone-600 h-10 rounded p-1"
		>{{ ticket.description.slice(0, 80) }}</p>
	</article>
</template>


<script setup>
import { defineEmits, defineProps } from 'vue'


defineProps({
	ticket: Object
})

const $emit = defineEmits(["editTicket", "openDetail"])

</script>

