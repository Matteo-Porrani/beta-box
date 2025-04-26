<template>
	<BxButton
		:text="text"
		:label="label"
		:type="type"
		:size="size"
	>
		<template #default v-if="!right">
			<BxIcon :icon="icon" :size="size" class="-ms-0.5"/>
		</template>
		<template #rightSlot v-else>
			<BxIcon :icon="icon" :size="size"/>
		</template>
	</BxButton>
</template>


<script>
import BxButton from "@/modules/ui/components/BxButton.vue";
import BxIcon from "@/components/UI/BxIcon.vue";
export default {
	name: "BxIconButton",

	components: {
		BxIcon,
		BxButton
	},

	props: {
		right: Boolean,
		icon: String,
		text: Boolean,
		label: String,
		type: String,
		size: String
	},

	computed: {},

}
</script>


<style scoped></style>
