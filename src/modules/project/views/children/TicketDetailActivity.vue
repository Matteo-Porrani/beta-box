
<template>
	<div
		class="rounded border p-2"
	>

		<p class="flex gap-2 items-center text-xl font-bold">
			<DetailIcon icon="stop_watch"/>
			{{ activity.total }}
		</p>

		<div class="h-6"/>

		<ActivityTimeItem
			v-for="item in activity.items"
			:key="item.day"
			:item="item"
		/>
	</div>
</template>


<script>
import ActivityTimeItem from "@/modules/project/components/detail/ActivityTimeItem.vue";
import DetailIcon from "@/modules/project/components/detail/DetailIcon.vue";

export default {
	name: "TicketDetailActivity",
	components: { DetailIcon, ActivityTimeItem },

	inject: ["activity"],
}
</script>



