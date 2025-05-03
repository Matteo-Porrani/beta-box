<template>

	<TheFullscreenPreview
		v-if="showPreview"
		:image="previewImage"
		@close-preview="showPreview = false"
	/>

	<!-- CREATE MODAL -->
	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<h2 class="font-bold text-3xl">Create image file</h2>
		</template>
		<template #body>

			<label for="">File name</label>

			<div class="h-1"/>

			<input
				type="text"
				v-model="newFileName"
				class="block w-full"
				ref="filename_input_ref"
			>
		</template>

		<template #footer>
			<div class="w-full flex justify-between">
				<!-- THE BUTTONS -->
				<BxButton
					type="soft"
					label="Cancel"
					@click="onCancel"
				/>

				<BxButton
					label="Save"
					@click="onSave"
				/>
			</div>
		</template>

	</BxModal>

	<!-- MAIN CONTENT -->
	<DefaultLayout>
		<div v-if="contentLoaded">

			<div class="text-2xl">Images</div>

			<div class="h-4"/>

			<BxButton
				label="Paste"
				@click="pasteContent"
			/>

			<div class="h-4"/>

			<ContentImageTable
				:images="images"
				show-actions
				@thumbnail-clicked="openPreview"
				@delete-item="deleteItem"
				@download-item="downloadItem"
			/>

		</div>
	</DefaultLayout>
</template>


<script>
import { nextTick } from "vue";
import ContentSrv from "@/modules/core/services/ContentSrv";
import ClipboardSrv from "@/modules/core/services/ClipboardSrv";
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import ContentImageTable from "@/modules/admin/components/ContentImageTable.vue";
import TheFullscreenPreview from "@/modules/core/components/layout/TheFullscreenPreview.vue";


export default {
	name: 'ContentView',

	components: {
		TheFullscreenPreview,
		ContentImageTable,
		DefaultLayout,
	},

	data() {
		return {
			contentLoaded: false,
			localKey: 1,
			images: null,
			newFileName: "",

			showPreview: false,
			previewImage: {
				fileName: null,
				dataUrl: null
			}
		}
	},

	watch: {
		async localKey() {
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
			this.$refs.modal_ref.open();
			nextTick(() => this.$refs.filename_input_ref.focus())
		},

		// =============================================

		async onSave() {
			await ClipboardSrv.pasteClipboardContent(this.newFileName);
			this.$refs.modal_ref.close();
			this.newFileName = null;
			this.localKey++;
		},

		onCancel() {
			this.$refs.modal_ref.close();
		},

		// =============================================

		openPreview(id) {
			this.previewImage = this.images.find(im => Number(im.id) === Number(id));
			this.showPreview = true;
		},

		// =============================================

		async deleteItem(id) {
			await ContentSrv.deleteItem(id);
			this.localKey++;
		},

		async downloadItem(id) {
			await ContentSrv.downloadItem(id);
		}

	}
};
</script>


<style scoped>
input {
	@apply bg-stone-700 rounded text-stone-200 p-1 text-xl
}
</style>
