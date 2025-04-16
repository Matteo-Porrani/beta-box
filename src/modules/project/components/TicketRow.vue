<template>
	<article
		class="grid gap-2 border border-stone-500 text-stone-300 rounded p-1"
		:class="{ 'bg-stone-500' : ticket.isHeader }"
	>

		<div>{{ ticket.id }}</div>

<!--		<div>{{ ticket.hydratedStatus?.name }}</div>-->

		<div :title="ticket.hydratedStatus">
			<BxBadge
				v-if="ticket.hydratedStatus"
				:label="ticket.hydratedStatus.name"
				:color="ticket.hydratedStatus.color?.name ?? 'stone'"
				:shade="ticket.hydratedStatus.color?.shade ?? '500'"
			/>
		</div>

		<div class="font-bold border border-stone-500 rounded">{{ ticket.title }}</div>
		<div>{{ ticket.hydratedTopic?.name ?? "-" }}</div>
		<div>{{ ticket.description }}</div>
		<div>{{ ticket.comment }}</div>
		<div>{{ sprints }}</div>

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

	computed: {
		sprints() {
			return this.ticket.hydratedSprint
				? this.ticket.hydratedSprint.map(s => s.name).join(" - ")
				: "-"
		}
	}

}
</script>


<style scoped>
article {
	grid-template-columns: 80px 120px 160px 160px 1fr 120px 160px;
}

article > div {
	//border: 1px solid #ccc;
	text-wrap: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 1px 4px;
}
</style>

