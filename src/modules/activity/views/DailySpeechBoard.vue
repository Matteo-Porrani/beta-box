<template>
	<DefaultLayout>
		<div
			v-if="loadDone"
			class="max-h-[90vh] bx-scrollbar"
		>

			<BxIconButton
				text
				icon="angle_left"
				label="Back"
				@click="$router.go(-1)"
			/>

			<div class="h-4"/>

			<div class="grid grid-cols-5 gap-8 ms-6">

				<TheDragDropWrapper
					has-handle
					:items="activities"
					@reorder="handleReorder"
					class="col-span-2"
				>
					<!-- here we must use the props' names as defined in the slot definition -->
					<template #default="{ item, isBeingDragged }">
						<DailySpeechActivityItem
							:item="item"
							:is-being-dragged="isBeingDragged"
						/>
					</template>
				</TheDragDropWrapper>

				<div class="col-span-2">
					<div class="text-xl mb-2">Comments</div>
					<textarea
						class="w-full h-[50vh] font-cc text-2xl resize-none focus:outline-none bg-zinc-700 rounded p-2"
					></textarea>
				</div>

			</div>

		</div>
	</DefaultLayout>
</template>


<script>
// service
import { activitySrv } from "@/modules/activity/services/ActivitySrv";
// components
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import TheDragDropWrapper from "@/modules/core/components/TheDragDropWrapper.vue";
import DailySpeechActivityItem from "@/modules/activity/components/DailySpeechActivityItem.vue";


export default {
	name: "DailySpeechBoard",

	components: {
		DailySpeechActivityItem,
		TheDragDropWrapper,
		DefaultLayout
	},

	data() {
		return {
			loadDone: false,
			activities: [],
		}
	},

	created() {
		this.initScreen();
	},

	methods: {
		initScreen() {
			const boardDate = this.$route.params.dayDate;
			const data = activitySrv.getActivitiesByRange({ start: boardDate, end: boardDate })

			if (data) this.activities = this.updateOrderProp(data[0]?.activities); // add 'order' prop
			this.loadDone = true
		},

		handleReorder(reorderedItems) {
			this.activities = this.updateOrderProp(reorderedItems); // maintain 'order' prop, unused for now...
		},

		updateOrderProp(list) {
			return list.map((a, idx) => ({ ...a, order: idx + 1 }))
		}
	}
}
</script>



