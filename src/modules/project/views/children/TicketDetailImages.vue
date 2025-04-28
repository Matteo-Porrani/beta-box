<template>
	<section class="grid grid-cols-8 grid-rows-8 gap-2">

		<article
			v-for="img in images"
			:key="img.id"
			class="bg-stone-700 rounded overflow-hidden"
		>
			<img :src="img.dataUrl" alt="thumbnail" class="w-full h-[80%] object-cover" />

			<p class="text-xs font-mono p-1">{{ img.name }}</p>
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

export default {
	name: "TicketDetailImages",
	components: {

	},

	inject: ["images"],

	data() {
		return {
			showPreview: false,
		}
	},

	beforeMount() {
		for (const img of this.images) {
			console.log("img ID", img.id, img.name)

			ContentSrv.addDataUrlValue(img);
		}
	},

	methods: {

	}

}
</script>



