<template>
	<div>
		<router-link to="/">Home</router-link>
		<router-link to="/about">About</router-link>
	</div>
</template>



<script>

export default {
	name: "TheMainMenu"
}
</script>


<style scoped>
div {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>