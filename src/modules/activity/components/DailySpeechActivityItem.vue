<template>
	<article
		class="border border-stone-500 rounded space-y-2 p-2"
	>

		<div class="flex gap-2 text-sm">
			<div
				class="text-zinc-800 rounded flex-1 px-1"
				:class="headerColorClass"
			>
				<p>{{ typeLabel }}</p>
			</div>

			<div class="w-16 grid place-items-center">
				<p>{{ item.duration }}</p>
			</div>
		</div>

		<div
			v-for="t in item.ticketInfo"
			:key="t.id"
			class="border border-zinc-500 rounded p-1"
		>
			<p class="font-bold">{{ t.title }}</p>
			<p>{{ t.desc }}</p>
		</div>

		<p class="text-xl">{{ item.description }}</p>
	</article>
</template>


<script>
import { activitySrv } from "@/modules/activity/services/ActivitySrv";

export default {
	name: "DailySpeechActivityItem",

	props: {
		item: {
			type: Object,
			required: true
		}
	},

	computed: {

		typeLabel() {
			return this.item?.type
				? activitySrv.getLabelFromActivityCode(this.item.type)
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
			return colorMap[this.item.type] || 'bg-stone-400';
		},

	},

}
</script>
