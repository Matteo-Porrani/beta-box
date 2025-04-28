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
				class="h-[94vh] grid grid-rows-[auto_1fr_auto] gap-2"
			>

				<TicketDetailHeader
					:ticket="ticket"
					@edit-ticket="onEditTicket"
				/>

				<div class="body grid grid-rows-[auto_1fr] overflow-y-auto mt-6">
					<nav class="flex gap-4 mb-2">
						<router-link
							v-for="t in tabs"
							:key="t"
							:to="{ name: `ticket_detail_${t}` }"
							:class="currLinkClass(t)"
						>
							{{ ucFirst(t) }}
						</router-link>
					</nav>

					<div class="grid rounded border border-stone-500 p-2 overflow-y-auto">
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
import { mapState } from "vuex";
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
	components: {
		DefaultLayout,
		TicketModalEditor,
		TicketDetailFooter,
		TicketDetailHeader,
	},

	data() {
		return {
			ticket: null,
			tabs: [ "notes", "images", "activity" ],
		}
	},

	provide() {
		return {
			activity: computed(() => this.ticket?.activity ? nrm(this.ticket?.activity) : []),
			activityItems: computed(() => this.ticket?.parsedActivity ? nrm(this.ticket?.parsedActivity.items) : []),
			notes: computed(() => this.ticket?.note ? nrm(this.ticket?.note) : []), // 'note' prop is provided as 'notes'
			images: computed(() => this.ticket?.content ? nrm(this.ticket?.content) : []), // 'note' prop is provided as 'notes'
		}
	},

	computed: {

		...mapState({
			coreKey: $s => $s.core.coreKey,
		}),

		ticketId() {
			return this.$route.params.id
		},

		currLinkClass() {
			return (keyword) => {
				return this.$route.path.includes(keyword)
					? "text-sky-500"
					: "text-stone-500"
			}
		}
	},

	watch: {
		coreKey() {
			this.getTicketData();
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
			console.log("this.ticket", this.ticket)
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

