<template>
	<section>
		<!-- ROW 1 -->
		<div class="grid grid-cols-6 items-center">
			<h1 class="col-span-2 flex gap-2 items-center text-2xl font-bold">
				<router-link
					class="w-8 grid place-content-center hover:text-sky-500 rounded"
					to="/project"
				>
					<BxIcon icon="angle_left" size="large"/>
				</router-link>

				<BxButton
					text
					:label="ticket.title"
					@click="$emit('editTicket')"
				/>
			</h1>

			<div class="col-span-2 grid grid-cols-2 gap-2">
				<div class="flex gap-2 items-center">
					<DetailIcon icon="folders"/>
					<p>{{ ticket.topic ? ticket.topic.name : "-" }}</p>
				</div>
				<div class="flex gap-2 items-center">
					<DetailIcon icon="team"/>
					<p>{{ ticket.team }}</p>
				</div>
			</div>

			<div class="flex gap-2 items-center">
				<PhaseStepper :curr-phase="ticket.phase"/>
			</div>

			<div class="flex gap-2 justify-end items-center">
				<BxBadge
					v-if="ticket.status"
					:title="ticket.status.id"
					:label="ticket.status.name"
					:color="ticket.status.color?.name ?? 'stone'"
					:shade="ticket.status.color?.shade ?? '500'"
					class="text-xl w-full"
				/>
			</div>
		</div>

		<div class="spacer h-1"/>

		<!-- ROW 2 -->
		<div class="grid grid-cols-6 border border-stone-500 rounded p-1">

			<div class="col-span-4 pe-4">
				<p class="text-xl text-nowrap text-ellipsis overflow-x-hidden">{{ ticket.description }}</p>
			</div>

			<div class="flex gap-2 col-span-2">
				<p class="bg-stone-700 rounded p-1 w-full">{{ ticket.comment }}</p>

				<div class="flex gap-2 items-center">
					<DetailIcon icon="stop_watch"/>
					<p>{{ ticket.parsedActivity.total }}</p>
				</div>

			</div>

		</div>
	</section>
</template>


<script>
import DetailIcon from "@/modules/project/components/detail/DetailIcon.vue";
import PhaseStepper from "@/modules/project/components/detail/PhaseStepper.vue";

export default {
	name: "TicketDetailHeader",
	components: {
		PhaseStepper,
		DetailIcon,
	},

	props: {
		ticket: Object
	},

	emits: ["editTicket"],

	methods: {
		async onCopy() {
			try {
				await navigator.clipboard.writeText(this.ticket.url);
				// copyBtn.value.classList.toggle("confirm-copy")
				// setTimeout(() => copyBtn.value.classList.toggle("confirm-copy"), 500)
			} catch(err) {
				console.error(err);
			}
		}

	}
}
</script>

