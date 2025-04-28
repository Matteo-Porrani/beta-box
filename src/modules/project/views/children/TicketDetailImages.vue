<template>

	<TheFullscreenPreview
		v-if="showPreview"
		:image="previewImage"
		@close-preview="showPreview = false"
	/>

	<section class="grid grid-cols-8 grid-rows-8 gap-2">

		<article
			v-for="img in images"
			:key="img.id"
			class="bg-stone-700 rounded overflow-hidden"
			@click="openPreview(img.id)"
		>
			<img :src="img.dataUrl" alt="thumbnail" class="w-full h-[80%] object-cover" />

			<p class="text-xs font-mono p-1">{{ img.name }}</p>
		</article>

		<article
			class="grid place-content-center bg-stone-700 rounded overflow-hidden"
		>
			<BxIconButton
				icon="add"
				text
				size="large"
				@click="$emit('addImage')"
			/>
		</article>

	</section>
</template>


<script>
/*
This screen section
- shows a list of image files
	- images are shown as grid with names as legend

As user
- I can add an image from the files list ("content" table)
- I can delete an image
- I can open an image in fullscreen preview

 */



import ContentSrv from "@/modules/core/services/ContentSrv";
import TheFullscreenPreview from "@/components/layout/TheFullscreenPreview.vue";

export default {
	name: "TicketDetailImages",

	components: {
		TheFullscreenPreview
	},

	inject: ["images"],

	data() {
		return {
			showPreview: false,
			previewImage: null,
		}
	},

	beforeMount() {
		for (const img of this.images) {
			ContentSrv.addDataUrlValue(img);
		}
	},

	methods: {

		openPreview(id) {
			const imageToOpen = this.images.find(img => Number(img.id) === Number(id));
			if (imageToOpen) {
				this.previewImage = imageToOpen;
				this.showPreview = true;
			}
		}

	}

}
</script>



