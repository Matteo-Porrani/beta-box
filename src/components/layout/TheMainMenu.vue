<template>
	<div>
		<h1>
			<IconPackage :size="32" color="#818cf8"/>
			<span>B-Box</span>
		</h1>

		<router-link to="/">Home</router-link>
		<router-link to="/about">About</router-link>
	</div>
</template>



<script>
import { IconPackage } from "@tabler/icons-vue"

export default {
	name: "TheMainMenu",
	components: {
		IconPackage
	}
}
</script>


<style scoped>
div {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

h1 {
	font-size: 1.75rem;
	display: flex;
	align-items: center;
	gap: 4px;
}
</style>
