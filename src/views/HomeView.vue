<template>
  <section class="home-view-root">

		<h1>Home</h1>
		<DummyOne :count="123"/>

  </section>
</template>

<script>

import DummyOne from "@/components/DummyOne.vue";

export default {
	name: 'HomeView',
	components: {
		DummyOne

	},
};
</script>


<style>
.home-view-root {
	border: 1px solid #C1C2C9;
}
</style>
