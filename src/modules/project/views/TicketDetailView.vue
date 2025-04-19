<template>
	<DefaultLayout>
		<template #default>
			<section
				v-if="ticket"
				data-test="ticket-detail-view-root"
				class="h-[92vh] grid grid-rows-[auto_1fr_auto] gap-2"
			>

				<TicketDetailHeader :ticket="ticket"/>

				<div class="body pt-16">
					<nav class="flex gap-4 text-xl">
						<router-link
							to="/activity"
						>Activity</router-link>
<!--						<router-link-->
<!--							to="/notes"-->
<!--						>Notes</router-link>-->
					</nav>

					<div class="h-4"/>

					<router-view/>
				</div>

				<TicketDetailFooter :ticket="ticket"/>

			</section>
		</template>
	</DefaultLayout>
</template>


<script>
import { computed } from "vue";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ProjectSrv from "@/modules/project/services/ProjectSrv";
import TicketDetailHeader from "@/modules/project/components/detail/TicketDetailHeader.vue";
import TicketDetailFooter from "@/modules/project/components/detail/TicketDetailFooter.vue";
import { nrm } from "@/modules/core/utils/core-utils";

export default {
	name: "TicketDetailView",
	components: { TicketDetailFooter, TicketDetailHeader, DefaultLayout },

	data() {
		return {
			ticket: null,
		}
	},

	provide() {
		return {
			activity: computed(() => nrm(this.ticket?.activity))
		}
	},

	computed: {
		ticketId() {
			return this.$route.params.id
		},
	},

	beforeMount() {
		this.ticket = ProjectSrv.getTicketById(this.ticketId);
	}
}
</script>

