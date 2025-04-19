<template>
	<article
		class="grid gap-2 border border-stone-500 text-stone-300 rounded p-1"
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
			<div class="font-bold border border-stone-500 rounded">{{ ticket.title }}</div>
			<div>{{ ticket.topic?.name ?? "-" }}</div>
			<div>{{ ticket.description }}</div>
			<div>{{ ticket.comment }}</div>
			<div>{{ sprints }}</div>
			<div>{{ ticket.phase }}</div>
		</template>

	</article>
</template>


<script>
import BxBadge from "@/components/UI/BxBadge.vue";

export default {

	name: "TicketRow",
	components: { BxBadge },

	props: {
		ticket: Object,
	},

	data() {
		return {
			headerLabels: ["id", "status", "title", "topic",  "description", "comment", "sprint", "phase"]
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
	grid-template-columns: 70px 120px 10% 10% 1fr 10% 8% 8%;
}

article > div {
	text-wrap: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 1px 4px;
}
</style>

