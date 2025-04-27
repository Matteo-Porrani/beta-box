<template>
	<section>
		<!-- ROW 1 -->
		<div class="grid grid-cols-6 items-center">
			<h1 class="col-span-2 flex gap-2 items-center text-2xl font-bold">
				<router-link
					class="w-8 grid place-content-center hover:text-lime-600 rounded"
					to="/project"
				>
					<BxIcon icon="angle_left" size="large"/>
				</router-link>
				<button
					class="hover:text-lime-600"
					@click="$emit('editTicket')"
				>
					{{ ticket.title }}
				</button>
			</h1>

			<div class="col-span-2 flex gap-2">
				<button
					@click="onCopy"
					class="text-stone-500 hover:text-lime-500"
				>
					<BxIcon icon="copy"/>
				</button>

				<div class="text-nowrap overflow-x-hidden overflow-ellipsis pe-4">
					<a
						:href="ticket.url"
						class="font-mono text-xs hover:text-lime-500 hover:underline"
						target="_blank"
					>{{ ticket.url }}</a>
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

		<div class="spacer h-2"/>

		<!-- ROW 2 -->
		<div class="grid grid-cols-6 border border-stone-500 rounded p-1">
			<div class="flex gap-2 items-center">
				<DetailIcon icon="folders"/>
				<p>{{ ticket.topic ? ticket.topic.name : "-" }}</p>
			</div>
			<div class="flex gap-2 items-center">
				<DetailIcon icon="team"/>
				<p>{{ ticket.team }}</p>
			</div>
			<div class="flex gap-2 items-center">
				<DetailIcon icon="stop_watch"/>
				<p>{{ ticket.parsedActivity.total }}</p>
			</div>

			<div></div>

			<div class="col-span-2 bg-stone-700 rounded p-1">
				<p>{{ ticket.comment }}</p>
			</div>

		</div>

		<div class="spacer h-2"/>

		<!-- ROW 3 -->
		<div class="h-16 text-xl col-span-4 bg-lime-900 rounded p-1">
			<p>{{ ticket.description }}</p>
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

