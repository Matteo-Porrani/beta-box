<template>
	<TicketModalEditor
		ref="ticketEditor_ref"
	/>

	<DefaultLayout>
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


