<template>
	<div
		class="border-2 border-zinc-700 rounded space-y-2 p-2"
		:class="{
			'bg-zinc-900': isBeingDragged
		}"
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
			class="bg-zinc-700 text-sm rounded p-1"
		>
			<p class="font-bold">{{ t.title }}</p>
			<p>{{ t.desc }}</p>
		</div>

		<p>{{ item.description }}</p>
	</div>
</template>


<script>
// Vue & composables
import { toRef } from 'vue';
import { useActivityType } from "@/modules/activity/composables/useActivityType";
// services
import { activitySrv } from "@/modules/activity/services/ActivitySrv";

export default {
	name: "DailySpeechActivityItem",

	props: {
		item: {
			type: Object,
			required: true
		},
		isBeingDragged: {
			type: Boolean,
			default: false
		},
	},

	setup(props) {
		const itemRef = toRef(props, 'item');
		const { typeLabel, headerColorClass } = useActivityType(itemRef, activitySrv);
		
		return {
			typeLabel,
			headerColorClass
		};
	},

}
</script>
