<template>
	<Teleport to="#previewWrapper">
		<section
			ref="modal_preview_ref"
			class="absolute inset-0 z-50 p-4"
			style="background: rgba(28, 25, 23, .8)"
		>

			<div
				v-if="image.dataUrl"
				class="relative rounded overflow-hidden h-[100%] place-content-center"
			>
				<BxIconButton
					text
					type="soft"
					icon="xmark"
					size="xlarge"
					class="size-12 text-3xl text-stone-400 absolute right-0 top-4"
					@click="$emit('closePreview')"
				/>
				<p class="absolute left-10 top-10 bg-stone-800 rounded p-1 px-4">{{ image.name }}</p>

				<img
					:src="image.dataUrl"
					alt="preview"
					class="h-full object-contain mx-auto"
				/>

			</div>
		</section>
	</Teleport>
</template>


<script>
export default {
	name: "TheFullscreenPreview",

	props: {
		image: Object,
	},

	emits: ["closePreview"],

	data() {
		return {

		}
	},

	computed: {

	},


}
</script>


<style scoped>

</style>
