<template>
	<article
		class="grid gap-2 border border-stone-500 text-stone-300 rounded p-1"
		:class="{ 'bg-stone-500' : ticket.isHeader }"
	>

		<div>{{ ticket.id }}</div>
		<div>{{ ticket.comment }}</div>
		<div class="font-bold border border-stone-500 rounded px-2 py-1">{{ ticket.title }}</div>
		<div>{{ ticket.hydratedTopic.name }}</div>
		<div>{{ ticket.description }}</div>
		<div>{{ sprints }}</div>

	</article>
</template>


<script>
export default {

	name: "TicketRow",

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
	grid-template-columns: 80px 120px 160px 160px 1fr 160px;
}

article > div {
	//border: 1px solid #ccc;
	text-wrap: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 2px;
}
</style>