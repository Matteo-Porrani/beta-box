<template>
	<DefaultLayout>
		<template #default>

			<h1 class="text-3xl">TicketDetailView</h1>
			<h1 class="text-3xl">{{ ticketId }}</h1>

			<section v-if="ticket">
				<pre>{{ ticket }}</pre>
			</section>


		</template>
	</DefaultLayout>
</template>


<script>

import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ProjectSrv from "@/modules/project/services/ProjectSrv";

export default {
	name: "TicketDetailView",
	components: { DefaultLayout },

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