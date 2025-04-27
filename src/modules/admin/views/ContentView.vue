<template>
	<DefaultLayout>
		<div v-if="contentLoaded">

			<div class="text-2xl">ContentView</div>

		</div>
	</DefaultLayout>
</template>


<script>
import DefaultLayout from "@/components/layout/DefaultLayout.vue";


export default {
	name: 'ContentView',

	components: {
		DefaultLayout,
	},

	data() {
		return {
			contentLoaded: false,

		}
	},

	computed: {


	},

	watch: {

	},

	async mounted() {


		this.contentLoaded = true;
	},

	methods: {
	}
};
</script>


<style scoped>

</style>
