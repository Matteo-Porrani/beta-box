<template>
	<div class="">

		<div class="w-fit">
			<router-link
				to="/project"
			>
				<BxIcon
					icon="arrow_left"
					class="hover:text-lime-500"
				/>
			</router-link>
		</div>

		<div class="h-2"/>

		<div class="grid grid-cols-5 items-center">
			<h1 class="text-2xl font-bold">{{ ticket.title }}</h1>

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
				<DetailIcon icon="dashboard"/>
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

		<div class="grid grid-cols-6 gap-10 h-16 text-xl">
			<div class="col-span-4 bg-stone-700 rounded p-1">
				<p>{{ ticket.description }}</p>
			</div>

			<div class="col-span-2 bg-stone-700 rounded p-1">
				<p>{{ ticket.comment }}</p>
			</div>

		</div>
	</div>
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
}
</script>

