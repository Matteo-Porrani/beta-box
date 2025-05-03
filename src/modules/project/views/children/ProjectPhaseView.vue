<template>
	<div class="grid h-[88vh] overflow-y-hidden">
		<div class="grid grid-cols-5 gap-2 overflow-y-hidden">

			<PhaseStack
				v-for="p in phases"
				:key="p"
				:phase="p"
				:stack="ticketsByPhase[p]"
				@edit-ticket="onEditTicket"
				@open-detail="onOpenDetail"
			/>

		</div>
	</div>
</template>


<script>
import ProjectSrv from "@/modules/project/services/ProjectSrv";
import PhaseStack from "@/modules/project/components/PhaseStack.vue";

export default {
	name: "ProjectPhaseView",

	components: {
		PhaseStack
	},

	emits: ["editTicket", "openDetail"],

	data() {
		return {
			phases: ["A", "B", "C", "D", "E"]
		}
	},

	computed: {
		ticketsByPhase() {
			return ProjectSrv.getTicketsByPhase()
		}
	},

	methods: {
		onEditTicket(id) {
			this.$emit('editTicket', id)
		},

		onOpenDetail(id) {
			this.$router.push({
				name: "ticket_detail_notes",
				params: { id: id },
				query: { from: "project_phase" }
			})
		}
	},
}
</script>