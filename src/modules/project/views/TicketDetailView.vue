<template>

	<TicketModalEditor
		ref="ticketEditor_ref"
		@editor-closed="onEditorClosed"
	/>

	<DefaultLayout>
		<template #default>
			<section
				v-if="ticket"
				data-test="ticket-detail-view-root"
				class="h-[92vh] grid grid-rows-[auto_1fr_auto] gap-2"
			>

				<TicketDetailHeader
					:ticket="ticket"
					@edit-ticket="onEditTicket"
				/>

				<div class="body grid grid-rows-[auto_1fr]">
					<nav class="flex gap-8 text-xl mb-2">
						<router-link
							v-for="t in tabs"
							:key="t"
							:to="{ name: `ticket_detail_${t}` }"
							:class="currLinkClass(t)"
						>
							{{ ucFirst(t) }}
						</router-link>
					</nav>

					<div class="rounded border border-stone-500 p-2">
						<router-view/>
					</div>
				</div>

				<TicketDetailFooter :ticket="ticket"/>

			</section>
		</template>
	</DefaultLayout>
</template>


<script>
// Vue related
import { computed } from "vue";
// services
import ProjectSrv from "@/modules/project/services/ProjectSrv";
// utils
import { nrm, ucFirst } from "@/modules/core/utils/core-utils";
// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import TicketDetailHeader from "@/modules/project/components/detail/TicketDetailHeader.vue";
import TicketDetailFooter from "@/modules/project/components/detail/TicketDetailFooter.vue";
import TicketModalEditor from "@/modules/project/components/TicketModalEditor.vue";


export default {
	name: "TicketDetailView",
	components: { TicketModalEditor, TicketDetailFooter, TicketDetailHeader, DefaultLayout },

	data() {
		return {
			ticket: null,
			tabs: ["activity", "notes"],
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

		currLinkClass() {
			return (keyword) => {
				return this.$route.path.includes(keyword) ? "text-lime-500" : "text-stone-500"
			}
		}
	},

	beforeMount() {
		this.getTicketData();
	},

	methods: {
		ucFirst,

		// ============================================= INIT

		getTicketData() {
			this.ticket = ProjectSrv.getTicketById(this.ticketId);
		},

		// ============================================= EDITOR

		onEditTicket() {
			this.$refs.ticketEditor_ref.openEditor(this.ticketId);
		},

		onEditorClosed() {
			this.getTicketData();
		}
	}
}
</script>

