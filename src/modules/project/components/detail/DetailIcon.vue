<template>
	<div class="bg-stone-900 text-stone-400 rounded p-1">
		<BxIcon :icon="icon"/>
	</div>
</template>


<script>
// import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "DetailIcon",
	// components: { BxIcon },

	props: {
		icon: String,
	}

}
</script>