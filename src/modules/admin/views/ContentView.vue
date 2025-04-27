<template>
	<DefaultLayout>
		<div v-if="contentLoaded">

			<div class="text-2xl">ContentView</div>

			<BxButton
				label="Paste"
				@click="pasteContent"
			/>

		</div>
	</DefaultLayout>
</template>


<script>
import ClipboardSrv from "@/modules/core/services/ClipboardSrv";
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

	computed: {},

	watch: {},

	async mounted() {


		this.contentLoaded = true;
	},

	methods: {

		async pasteContent() {
			console.log("//// pasteContent")

			await ClipboardSrv.pasteClipboardContent();

		}
	}
};
</script>


<style scoped>

</style>
