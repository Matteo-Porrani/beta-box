<template>

	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<span></span>
		</template>

		<template #body>
			<ContentImageTable
				:images="availableImages"
				@checkbox-change="onCheckboxChange"
			/>
		</template>

		<template #footer>
			<div class="flex justify-between w-full">
				<BxButton
					type="soft"
					label="Cancel"
					@click="onCancel"
				/>
				<BxButton
					label="Save"
					@click="saveChanges"
				/>
			</div>
		</template>
	</BxModal>

	<TheFullscreenPreview
		v-if="showPreview"
		:image="previewImage"
		@close-preview="showPreview = false"
	/>

	<!-- IMAGES GRID -->
	<section class="grid grid-cols-8 grid-rows-8 gap-2">

		<article
			v-for="img in images"
			:key="img.id"
			class="bg-stone-700 rounded overflow-hidden"
		>
			<img
				:src="img.dataUrl" alt="thumbnail"
				class="w-full h-24 object-cover cursor-pointer"
				@click="openPreview(img.id)"
			/>

			<div class="grid grid-cols-6 gap-2">
				<BxIconButton
					text
					size="small"
					type="danger"
					icon="trash"
					@click="onRemoveImage(img.id)"
				/>
				<p class="text-[10px] text-nowrap overflow-x-hidden overflow-ellipsis col-span-5 font-mono p-1">{{ img.name }}</p>
			</div>
		</article>

		<article
			class="grid place-content-center bg-stone-700 rounded overflow-hidden"
		>
			<BxIconButton
				icon="grid"
				text
				size="large"
				@click="openSelectionModal"
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
- I can add / remove links to images from the files list ("content" table)
- I can open an image in fullscreen preview
 */


// services
import ContentSrv from "@/modules/core/services/ContentSrv";
import EntitySrv from "@/modules/core/services/EntitySrv";
// components
import TheFullscreenPreview from "@/modules/core/components/layout/TheFullscreenPreview.vue";
import ContentImageTable from "@/modules/admin/components/ContentImageTable.vue";


export default {
	name: "TicketDetailImages",

	components: {
		ContentImageTable,
		TheFullscreenPreview
	},

	inject: ["images"],

	emits: ["contentUpdate"],

	data() {
		return {
			showPreview: false,
			previewImage: null,
			selection: null,
		}
	},

	computed: {

		availableImages() {
			const allImages = EntitySrv.getItems("content")
			const selectedIds = this.images.map(i =>  Number(i.id));
			return allImages.filter(image => !selectedIds.includes(Number(image.id)));
		},

	},

	beforeMount() {
		for (const img of this.images) {
			ContentSrv.addDataUrlValue(img);
		}
	},

	mounted() {
		this.selection = this.images.map(img => Number(img.id));
	},

	methods: {

		// ============================================= OPEN PREVIEW & MODAL

		openPreview(id) {
			const imageToOpen = this.images.find(img => Number(img.id) === Number(id));
			if (imageToOpen) {
				this.previewImage = imageToOpen;
				this.showPreview = true;
			}
		},

		async openSelectionModal() {
			this.$refs.modal_ref.open();
		},

		// =============================================

		// React to change in selection
		onCheckboxChange(id) {
			if (this.selection.includes(Number(id))) {
				this.selection = this.selection.filter(imageId => Number(imageId) !== Number(id));
			} else {
				this.selection.push(Number(id))
			}
		},

		onRemoveImage(id) {
			this.onCheckboxChange(id);
			this.saveChanges();
		},

		// ============================================= SAVE CHANGES

		async saveChanges() {
			this.$emit("contentUpdate", this.selection.join(":"))
			this.$refs.modal_ref.close();
		},

		onCancel() {
			this.$refs.modal_ref.close();
		},

	},

}
</script>



