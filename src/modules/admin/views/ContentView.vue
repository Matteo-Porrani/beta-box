<template>
	<DefaultLayout>
		<div v-if="contentLoaded">

			<div class="text-2xl">ContentView</div>

			<BxButton
				label="Paste"
				@click="pasteContent"
			/>

			<div class="h-8"/>


			<template v-if="images">

				<p>{{ localKey }}</p>

				<article
					v-for="i in images"
					:key="i.id"
					class="grid grid-cols-4 border rounded mb-1"
				>
					<div class="size-12 border rounded">
						<img :src="i.dataUrl" alt="thumbnail" />
					</div>

					<div>
						<p>{{ i.id }}</p>
						<p>{{ i.name }} </p>
					</div>

				</article>
			</template>

		</div>
	</DefaultLayout>
</template>


<script>
import ClipboardSrv from "@/modules/core/services/ClipboardSrv";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ContentSrv from "@/modules/core/services/ContentSrv";


export default {
	name: 'ContentView',

	components: {
		DefaultLayout,
	},

	data() {
		return {
			contentLoaded: false,
			localKey: 1,
			images: null,
		}
	},

	computed: {

	},

	watch: {
		async localKey() {
			console.log("W...")
			await this.initScreen();
		}
	},

	async mounted() {
		await this.initScreen();
		this.contentLoaded = true;
	},

	methods: {

		async initScreen() {
			this.images = await ContentSrv.getContentItems();
		},

		async pasteContent() {
			await ClipboardSrv.pasteClipboardContent();
			this.localKey++;
		},


	}
};
</script>


<style scoped>

</style>
