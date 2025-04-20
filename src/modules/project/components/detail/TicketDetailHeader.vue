<template>
	<section>
		<!-- TOP -->
		<div class="grid grid-cols-6 gap-4 items-center">
			<h1 class="col-span-2 flex gap-2 items-center text-2xl font-bold">
				<router-link
					class="w-8 grid place-content-center hover:bg-stone-600 border-stone-500 border rounded"
					to="/project"
				>
					<BxIcon icon="arrow_left"/>
				</router-link>
				{{ ticket.title }}

				<button @click="$emit('editTicket')">
					<BxIcon icon="edit"/>
				</button>
			</h1>

			<div class="flex gap-2 items-center">
				<DetailIcon icon="team"/>
				<p>{{ ticket.team }}</p>
			</div>

			<div class="flex gap-2 items-center">
<!--				<DetailIcon icon="cards"/>-->
				<DetailIcon icon="planet"/>
				<p>{{ ticket.topic ? ticket.topic.name : "-" }}</p>
			</div>


			<div class="flex gap-2 items-center">
<!--				<DetailIcon icon="dashboard"/>-->
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

		<div class="h-5"/>

		<!-- BOTTOM -->
		<div class="grid grid-cols-6 gap-6 h-16 text-xl">
			<div class="col-span-4 bg-stone-700 rounded p-1">
				<p>{{ ticket.description }}</p>
			</div>
			<div class="col-span-2 bg-stone-700 rounded p-1">
				<p>{{ ticket.comment }}</p>
			</div>
		</div>

		<!-- URL -->
		<div class="h-8">
			<a
				:href="ticket.url"
				class="font-mono text-sm hover:text-lime-500 hover:underline"
				target="_blank"
			>{{ ticket.url }}</a>
		</div>

		<div class="spacer h-8"></div>

	</section>
</template>


<script>
import BxBadge from "@/components/UI/BxBadge.vue";
import BxIcon from "@/components/UI/BxIcon.vue";
import DetailIcon from "@/modules/project/components/detail/DetailIcon.vue";
import PhaseStepper from "@/modules/project/components/detail/PhaseStepper.vue";

export default {
	name: "TicketDetailHeader",
	components: { PhaseStepper, DetailIcon, BxIcon, BxBadge },

	props: {
		ticket: Object
	},

	emits: ["editTicket"],
}
</script>

