<template>
	<div>
		<h1>
			<IconPackage :size="32" color="#0ea5e9"/>
			<span>B-Box</span>
		</h1>

		<!--	specific icon defined here	-->
		<MenuItem
			label="Home"
			dest="/"
		>
			<template #icon>
				<IconHome/>
			</template>
		</MenuItem>

		<MenuItem
			label="Tasks"
			dest="/tasks"
		>
			<template #icon>
				<IconStack2/>
			</template>
		</MenuItem>

		<!--	default icon will be used here	-->
		<MenuItem
			label="About"
			dest="/about"
		/>
	</div>
</template>


<script>
import MenuItem from "@/components/UI/MenuItem.vue";
import {
	IconPackage,
	IconHome,
	IconStack2,
} from "@tabler/icons-vue"

export default {
	name: "TheMainMenu",
	components: {
		MenuItem,
		IconPackage,
		IconHome,
		IconStack2
	}
}
</script>


<style scoped>
div {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

h1 {
	font-size: 1.75rem;
	display: flex;
	align-items: center;
	gap: 4px;
	margin-bottom: 4rem;
}
</style>
