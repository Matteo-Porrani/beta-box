
<template>
	<section>
		<ActivityTimeItem
			v-for="item in activityItems"
			:key="item.day"
			:item="item"
		/>

		<p
			v-if="activityItems.length < 1"
			class="flex gap-2 items-center text-stone-500 p-2"
		>
			<BxIcon icon="report" size="large"/>
			<span class="text-lg">No tracked activity</span>
		</p>
	</section>
</template>


<script>
import ActivityTimeItem from "@/modules/project/components/detail/ActivityTimeItem.vue";

export default {
	name: "TicketDetailActivity",
	components: {
		ActivityTimeItem
	},

	inject: ["activity", "activityItems"], // array of Activity items
}
</script>



