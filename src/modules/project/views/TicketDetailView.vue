<template>
	<DefaultLayout>
		<template #default>
			<section
				v-if="ticket"
				data-test="ticket-detail-view-root"
				class="h-[92vh] grid grid-rows-[auto_1fr_auto] gap-2"
			>

				<TicketDetailHeader :ticket="ticket"/>

				<div class="body grid grid-rows-[auto_1fr]">
					<nav class="flex gap-8 text-xl mb-2">
						<router-link
							:to="{ name: 'ticket_detail_activity' }"
							:class="currLinkClass('activity')"
						>
							Activity
						</router-link>

						<router-link
							:to="{ name: 'ticket_detail_notes' }"
							:class="currLinkClass('notes')"
						>
							Notes
						</router-link>
					</nav>

					<div class=" rounded border border-stone-500 p-2">
						<router-view/>
					</div>

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
import activity from "@/modules/activity";

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
		activity() {
			return activity
		},
		ticketId() {
			return this.$route.params.id
		},

		currChildren() {
			if (this.$route.path.includes("/activity")) return "activity";
			if (this.$route.path.includes("/notes")) return "notes";
			return "";
		},

		currLinkClass() {
			return (keyword) => {
				return this.$route.path.includes(keyword) ? "text-lime-500" : "text-stone-500"
			}
		}

	},

	beforeMount() {
		this.ticket = ProjectSrv.getTicketById(this.ticketId);
	}
}
</script>

