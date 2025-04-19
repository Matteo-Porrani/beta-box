<template>
	<DefaultLayout>
		<template #default>
			<section
				v-if="ticket"
				data-test="ticket-detail-view-root"
				class="h-[92vh] grid grid-rows-[auto_1fr_auto] gap-2"
			>

				<TicketDetailHeader :ticket="ticket"/>


				<div class="body border border-blue-400"></div>

				<TicketDetailFooter :ticket="ticket"/>

			</section>
		</template>
	</DefaultLayout>
</template>


<script>

import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ProjectSrv from "@/modules/project/services/ProjectSrv";
import TicketDetailHeader from "@/modules/project/components/detail/TicketDetailHeader.vue";
import TicketDetailFooter from "@/modules/project/components/detail/TicketDetailFooter.vue";

export default {
	name: "TicketDetailView",
	components: { TicketDetailFooter, TicketDetailHeader, DefaultLayout },

	data() {
		return {
			ticket: null,
		}
	},

	computed: {

		ticketId() {
			return this.$route.params.id
		}
	},

	beforeMount() {
		this.ticket = ProjectSrv.getTicketById(this.ticketId);
	}
}
</script>