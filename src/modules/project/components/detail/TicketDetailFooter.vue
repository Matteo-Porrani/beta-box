<template>
	<div class="">

		<div class="grid grid-cols-2 items-center">
			<div class="flex gap-2 items-center">
<!--				<BxIcon icon="calendar_cycle" class="text-stone-500"/>-->
				<DetailIcon icon="calendar_cycle"/>
				<p class="text-xl font-bold">{{ sprints }}</p>
			</div>

			<div class="flex justify-end">
				<BxBadge
					v-if="ticket.status"
					:label="activeBadge.name"
					:color="activeBadge.color"
					:shade="activeBadge.shade"
				/>
			</div>

		</div>

	</div>
</template>


<script>

import BxBadge from "@/components/UI/BxBadge.vue";
import BxIcon from "@/components/UI/BxIcon.vue";
import DetailIcon from "@/modules/project/components/detail/DetailIcon.vue";

export default {
	name: "TicketDetailFooter",
	components: {
		DetailIcon,
		// BxIcon,
		// BxIcon,
		BxBadge
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

