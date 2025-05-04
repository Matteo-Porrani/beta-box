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
					<nav class="flex gap-4 mb-1">
						<router-link
							v-for="t in tabs"
							:key="t"
							:to="{ name: `ticket_detail_${t}`, query: $route.query }"
							:class="currLinkClass(t)"
						>
							{{ ucFirst(t) }}
						</router-link>
					</nav>

					<div class="grid rounded border border-stone-500 p-1 overflow-y-auto">
						<router-view
							@content-update="onContentUpdate"
						/>
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
import { mapActions, mapMutations, mapState } from "vuex";
// services
import EntitySrv from "@/modules/core/services/EntitySrv";
import ProjectSrv from "@/modules/project/services/ProjectSrv";
// utils
import { nrm, ucFirst } from "@/modules/core/utils/core-utils";
// components
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import TicketDetailHeader from "@/modules/project/components/detail/TicketDetailHeader.vue";
import TicketDetailFooter from "@/modules/project/components/detail/TicketDetailFooter.vue";
import TicketModalEditor from "@/modules/project/components/TicketModalEditor.vue";



export default {
	name: "TicketView",
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

			images: computed(() => this.ticket?.content ? nrm(this.ticket?.content) : []),
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

		...mapActions("entity", ["loadTables", "updateItem"]),
		...mapMutations("core", ["INCREMENT_KEY"]),

		// ============================================= INIT

		getTicketData() {
			this.ticket = ProjectSrv.getTicketById(this.ticketId);
		},

		// ============================================= EDITOR

		/**
		 * Event listener to react to changes in images selection
		 * @param content
		 */
		async onContentUpdate(content) {
			// 1. retrieve raw ticket
			const srcTicket = EntitySrv.getItemById("ticket", this.$route.params.id);

			if (!srcTicket) return;

			// 2. call for update (store-entity)
			await this.updateItem({
				tableName: "ticket",
				item: { ...srcTicket, content },
			})

			// 3. trigger re-execution of this.getTicketData()
			this.INCREMENT_KEY();
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

