<template>
	<div
		data-test="activity-card-root"
		class="w-full h-32 grid grid-cols-[auto_1fr] border border-stone-500 rounded overflow-hidden"
	>
		<div
			class="relative flex flex-col justify-between items-center p-0.5"
			:class="headerColorClass"
		>
			<button
				class="block flex items-center gap-1 w-4"
				@click="onEditActivity"
			>
<!--				<button-->
<!--					@click="onEditActivity"-->
<!--				>-->
<!--					<BxIcon-->
<!--						icon="edit"-->
<!--						class="text-stone-800"-->
<!--						size="small"-->
<!--					/>-->
<!--				</button>-->
				<div class="absolute origin-left -rotate-90 top-24 left-2 text-end w-24 text-sm font-semibold text-stone-800">{{ typeLabel }}</div>
			</button>

		</div>

		<div class="relative bg-stone-900 py-1 px-2 overflow-hidden">

			<div class="card-header flex justify-between">
				<div>
					<a
						:href="activity.url"
						target="_blank"
						:title="activity.url"
						class="text-xs font-mono text-stone-400 hover:text-lime-600 text-nowrap"
					>
						<BxIcon v-if="activity.url" icon="link" size=""/>
					</a>
				</div>
				<div class="bg-stone-400 w-fit text-stone-800 text-end text-sm ms-auto rounded px-2 py-0.5 mb-1">{{ activity.duration }}</div>
			</div>

			<div class="main-content">
				<div v-if="activity.ticketTitles?.length" class="flex flex-wrap gap-1 mb-1">
				<span
					v-for="ticket in activity.ticketTitles"
					:key="ticket"
					class="text-sm font-bold text-stone-300 px-2 py-0.5 rounded border border-stone-500"
				>
					{{ ticket }}
				</span>
				</div>

				<div class="h-12 mb-1">
					<p class="text-stone-300 line-clamp-2">{{ activity.description }}</p>
				</div>
			</div>

			<!--	URL		-->
<!--			<div class="absolute bottom-1 left-1 right-1 overflow-ellipsis overflow-x-hidden">-->
<!--				<a-->
<!--					:href="activity.url"-->
<!--					target="_blank"-->
<!--					class="text-xs font-mono text-stone-400 hover:text-lime-600 text-nowrap"-->
<!--				>-->
<!--					{{ activity.url ?? '-' }}-->
<!--				</a>-->
<!--			</div>-->
		</div>
	</div>
</template>

<script>
import { activitySrv } from "@/modules/activity/services/ActivitySrv";
import { nrm } from "@/modules/core/utils/core-utils";
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "ActivityCard",

	components: {
		BxIcon
	},

	props: {
		activity: {
			type: Object,
			required: true,
		}
	},

	emits: ["editActivity"],

	computed: {

		typeLabel() {
			return this.activity?.type
				? activitySrv.getLabelFromActivityCode(this.activity.type)
				: "-";
		},

		headerColorClass() {
			const colorMap = {
				'$D': 'bg-yellow-400', // develop
				'$A': 'bg-purple-500', // analyze
				'$R': 'bg-sky-400', // meet
				'$E': 'bg-orange-500', // exchange
				'$O': 'bg-stone-400', // other
			};
			return colorMap[this.activity.type] || 'bg-stone-400';
		},

	},

	methods: {
		onEditActivity() {
			this.$emit("editActivity", nrm(this.activity));
		}
	},

}
</script>

