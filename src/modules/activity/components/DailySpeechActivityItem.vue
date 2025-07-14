<!--
This component is meant to be used as 'item' in TheDragDropWrapper.

The idea is to have a 'unit' that can have a specific display,
(in this case, a card representing an activity),
that will fit into the DragDropWrapper.

TheDragDropWrapper doesn't know anything about the specific display
of the 'items' it contains, it's just a container that allows reordering.
Nevertheless, to implement a better interaction with the user,
TheDragDropWrapper will provide some props to the 'item',
in order for the 'item' to know its current state.

The props are:
- isBeingDragged: boolean
- isDragOver: boolean

The 'isBeingDragged' prop is true when the item is being dragged.
So, we can change the display accordingly.

The 'isDragOver' prop is true when the item is being hovered.
So, for example, we can change the background color,
in order to inform the user that a drop zone is available.
-->


<template>
	<div
		class="h-32 border-2 border-zinc-700 rounded space-y-2 p-2"
		:class="{
			'bg-zinc-900': isBeingDragged,
			'bg-zinc-500': isDragOver,
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
		isDragOver: {
			type: Boolean,
			default: false
		}
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
