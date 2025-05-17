<template>
	<section>

		<!-- FILTER -->
		<div class="flex items-center gap-2 p-1 rounded border border-stone-500">
			<button
				class="bg-stone-700 hover:bg-stone-600 rounded py-1 px-2"
				@click="filterNeedle = ''"
			>
				<BxIcon icon="xmark"/>
			</button>

			<div class="relative w-72">
				<input type="text" v-model="filterNeedle" class="w-full">
				<BxIcon icon="search" class="absolute text-stone-500 right-1 top-1"/>
			</div>
		</div>

		<div class="h-2"/>

		<div class="grid h-[85vh] overflow-y-hidden">
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

	</section>
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
			filterNeedle: "",
			phases: ["A", "B", "C", "D", "E"]
		}
	},

	computed: {
		ticketsByPhase() {
			return ProjectSrv.getTicketsByPhase(this.filterNeedle)
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


<style scoped>
input {
	@apply bg-stone-700 rounded text-stone-200 p-1
}
</style>

