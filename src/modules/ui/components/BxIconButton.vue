<template>
	<BxButton
		:text="text"
		:label="label"
		:type="type"
		:size="size"
		:no-min-width="noMinWidth"
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
export default {
	name: "BxIconButton",

	props: {
		right: Boolean,
		icon: String,
		text: Boolean,
		label: String,
		type: String,
		size: String,
		noMinWidth: Boolean,
	},

}
</script>

