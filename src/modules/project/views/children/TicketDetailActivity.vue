
<template>
	<section>
<!--		<p class="flex gap-2 items-center text-xl font-bold">-->
<!--			<DetailIcon icon="stop_watch"/>-->
<!--			{{ activity.total }}-->
<!--		</p>-->

		<ActivityTimeItem
			v-for="item in activityItems"
			:key="item.day"
			:item="item"
		/>
	</section>
</template>


<script>
import ActivityTimeItem from "@/modules/project/components/detail/ActivityTimeItem.vue";
// import DetailIcon from "@/modules/project/components/detail/DetailIcon.vue";

export default {
	name: "TicketDetailActivity",
	components: {
		// DetailIcon,
		ActivityTimeItem
	},

	inject: ["activity", "activityItems"], // array of Activity items
}
</script>



