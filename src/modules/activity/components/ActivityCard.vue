<template>
	<div
		data-test="activity-card-root"
		class="w-full h-24 grid grid-cols-[auto_1fr] border border-stone-500 rounded overflow-hidden"
	>
		<div
			class="relative flex flex-col justify-between items-center p-0.5"
			:class="headerColorClass"
		>
			<button
				class="flex items-center gap-1 w-4"
				@click="onEditActivity"
			>
				<div class="absolute origin-left -rotate-90 top-24 left-2 text-end w-24 text-sm font-semibold text-stone-800">
					{{ typeLabel }}
				</div>
			</button>

		</div>

		<div class="relative bg-stone-900 py-1 px-2 overflow-hidden">

			<div class="card-header flex justify-between">
				<div v-if="activity.ticketInfo?.length" class="flex flex-wrap gap-1 mb-1">
					<button
						v-for="ticket in activity.ticketInfo"
						:key="ticket.title"
						:title="ticket.desc"
						class="text-sm font-bold text-stone-300 px-2 py-0.5 rounded border border-stone-500"
						@click="navToTicket(ticket.id)"
					>
						{{ ticket.title }}
					</button>
				</div>
				<div v-else></div>

				<div class="right-block flex gap-2">
					<a
						:href="activity.url"
						target="_blank"
						:title="activity.url"
						class="text-xs font-mono text-stone-400 hover:text-lime-600 text-nowrap"
					>
						<BxIcon v-if="activity.url" icon="link" size=""/>
					</a>
					<div class="bg-stone-400 w-fit text-stone-800 text-end text-sm ms-auto rounded px-2 py-0.5 mb-1">{{ activity.duration }}</div>
				</div>

			</div>

			<div class="main-content">
				<div class="h-12 mb-1">
					<p class="text-stone-300 line-clamp-2">{{ activity.description }}</p>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { toRef } from 'vue';
import { useActivityType } from "@/modules/activity/composables/useActivityType";
import { nrm } from "@/modules/core/utils/core-utils";
import { activitySrv } from "@/modules/activity/services/ActivitySrv";

export default {
	name: "ActivityCard",

	components: {},

	props: {
		activity: {
			type: Object,
			required: true,
		}
	},

	emits: ["editActivity"],

	setup(props) {
		const activityRef = toRef(props, 'activity');
		const { typeLabel, headerColorClass } = useActivityType(activityRef, activitySrv);
		
		return {
			typeLabel,
			headerColorClass
		};
	},

	methods: {
		onEditActivity() {
			this.$emit("editActivity", nrm(this.activity));
		},

		navToTicket(id) {
			this.$router.push({
				name: "ticket_detail_notes",
				params: { id: id },
				query: { from: "activity_root" }
			})
		},
	},

}
</script>

