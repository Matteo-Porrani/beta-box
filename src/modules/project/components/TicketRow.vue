<template>
	<article
		class="grid gap-1 border border-stone-500 text-stone-300 text-sm rounded p-1 h-8 items-center"
		:class="{ 'bg-stone-500' : ticket.isHeader, 'compact': compact }"
	>

		<template v-if="ticket.isHeader">
			<div v-for="l in headerLabels" :key="l">{{ l }}</div>
		</template>

		<template v-else>
			<div>{{ ticket.phase }}</div>
			<div>
				<BxBadge
					v-if="ticket.status"
					:title="ticket.status.id"
					:label="ticket.status.name"
					:color="ticket.status.color?.name ?? 'stone'"
					:shade="ticket.status.color?.shade ?? '500'"
				/>
			</div>

			<div class="grid place-content-center">
				<BxIconButton
					text
					icon="card_id"
					@click="$emit('openDetail', ticket.id)"
				/>
			</div>

			<button
				class="bg-stone-300 hover:bg-stone-400 text-stone-800 rounded grid items-center"
				@click="$emit('editTicket', ticket.id)"
			>
				{{ ticket.title }}
			</button>

			<div>{{ ticket.topic?.name ?? "-" }}</div>
			<div>{{ ticket.description }}</div>

			<!-- EXTRA INFO FIELDS -->
			<template v-if="!compact">
				<div>{{ ticket.team }}</div>
				<div>{{ ticket.comment }}</div>
				<div>{{ sprints }}</div>
				<div>{{ ticket.active }}</div>
			</template>

		</template>
	</article>
</template>


<script>
export default {

	name: "TicketRow",

	props: {
		ticket: Object,
		compact: Boolean
	},

	emits: ["openDetail", "editTicket"],

	computed: {
		headerLabels() {
			const cols = ["phase", "status", "", "title", "topic", "description"]
			if (!this.compact) {
				["team", "comment", "sprint", "active"].forEach(col => cols.push(col));
			}
			return cols;
		},

		sprints() {
			return (this.ticket.sprint && Array.isArray(this.ticket.sprint))
				? this.ticket.sprint.map(s => s.name).join(" / ")
				:  "-";
		},
	}

}
</script>


<style scoped>
article {
	grid-template-columns: 4% 10% 40px 10% 10% 1fr 10% 10% 4% 4%;
}

article.compact {
	grid-template-columns: 4% 10% 40px 10% 10% 1fr;
}

article > div {
	text-wrap: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 1px 4px;
}
</style>

