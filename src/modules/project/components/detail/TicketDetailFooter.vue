<template>
	<section
		data-test="ticket-detail-footer-root"
		class="grid grid-cols-2 items-center"
	>
		<div class="flex gap-2 items-center">
			<DetailIcon icon="sprint"/>
			<p class="text-xl font-bold">{{ sprints }}</p>
		</div>

		<div class="flex justify-end gap-2">
			<p>{{ activeBadge.name }}</p>
			<span
				class="size-6 rounded-full"
				:class="`bg-${activeBadge.color}-${activeBadge.shade}`"
			/>
		</div>
	</section>
</template>


<script>
import DetailIcon from "@/modules/project/components/detail/DetailIcon.vue";

export default {
	name: "TicketDetailFooter",
	components: {
		DetailIcon,
	},

	props: {
		ticket: Object
	},

	computed: {
		sprints() {
			return this.ticket.sprint ? this.ticket.sprint.map(s => s.name).join(" / ") : "-";
		},

		activeBadge() {
			return {
				name: this.ticket.active ? "active" : "inactive",
				color: this.ticket.active ? "lime" : "rose",
				shade: this.ticket.active ? "500" : "600",
			}
		}
	}
}
</script>

