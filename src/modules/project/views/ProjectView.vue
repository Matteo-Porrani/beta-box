<template>
	<TicketModalEditor
		ref="ticketEditor_ref"
	/>

	<DefaultLayout>

		<nav class="flex gap-4 mb-4">
			<router-link
				class="text-stone-500 w-24 text-center py-1 rounded"
				:to="{ name: 'project_board' }"
			>
				Board
			</router-link>
			<router-link
				class="text-stone-500 w-24 text-center py-1 rounded"
				:to="{ name: 'project_phase' }"
			>
				Phase
			</router-link>
		</nav>

		<router-view
			@edit-ticket="onEditTicket"
		/>
	</DefaultLayout>
</template>


<script>
// services
import ProjectSrv from "@/modules/project/services/ProjectSrv";
// components
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import TicketModalEditor from "@/modules/project/components/TicketModalEditor.vue";


export default {

	name: "ProjectView",
	components: {
		DefaultLayout,
		TicketModalEditor,
	},

	data() {
		return {
		}
	},

	beforeRouteEnter(to, from, next) {
		// Check if project data is loaded
		if (!ProjectSrv.projectDataLoaded()) {
			// If project data is not loaded, redirect to admin root route
			next({ name: "admin_root" })
		} else {
			// If project data is loaded, allow navigation to proceed normally
			next()
		}
	},

	methods: {

		onEditTicket(id) {
			this.$refs.ticketEditor_ref.openEditor(id);
		},

	}

}
</script>


<style scoped>
.router-link-exact-active {
	@apply text-sky-300 bg-sky-900
}
</style>
