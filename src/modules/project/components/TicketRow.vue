<template>
	<article
		class="grid gap-1 border border-stone-500 text-stone-300 text-sm rounded p-1 h-8 items-center"
		:class="{ 'bg-stone-500' : ticket.isHeader }"
	>

		<template v-if="ticket.isHeader">
			<div v-for="l in headerLabels" :key="l">{{ l }}</div>
		</template>

		<template v-else>

			<div>{{ ticket.id }}</div>
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
				<button
					class="hover:text-lime-500"
					@click="$emit('openDetail', ticket.id)"
				>
					<BxIcon icon="card_id"/>
				</button>
			</div>

			<button
				class="bg-stone-300 hover:bg-stone-400 text-stone-800 rounded grid items-center"
				@click="$emit('editTicket', ticket.id)"
			>
				{{ ticket.title }}
			</button>

			<div>{{ ticket.topic?.name ?? "-" }}</div>
			<div>{{ ticket.description }}</div>
			<div>{{ ticket.comment }}</div>
			<div>{{ sprints }}</div>
			<div>{{ ticket.phase }}</div>
			<div>{{ ticket.active }}</div>
		</template>

	</article>
</template>


<script>
import BxBadge from "@/components/UI/BxBadge.vue";
import BxIcon from "@/components/UI/BxIcon.vue";

export default {

	name: "TicketRow",
	components: { BxIcon, BxBadge },

	props: {
		ticket: Object,
	},

	emits: ["openDetail", "editTicket"],

	data() {
		return {
			headerLabels: ["id", "status", "", "title", "topic", "description", "comment", "sprint", "phase", "active"]
		}
	},

	computed: {
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
	grid-template-columns: 70px 120px 40px 10% 10% 1fr 10% 8% 8% 4%;
}

article > div {
	text-wrap: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 1px 4px;
}
</style>

