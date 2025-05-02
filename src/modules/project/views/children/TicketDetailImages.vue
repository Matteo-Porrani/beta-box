<template>

	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<span></span>
		</template>

		<template #body>
			<BxEntityPicker
				ref="ent_picker_ref"
				:field-desc="fieldDesc"
				entity="Content"
				:multiple="fieldDesc.multiple"
				@update:model-value="onValueUpdate"
			/>

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

	<p>{{ currSelection }}</p>
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
				@click="openEntityPicker"
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


// Vue related
import { nextTick } from "vue";
import { mapActions, mapMutations } from "vuex";
// services
import ContentSrv from "@/modules/core/services/ContentSrv";
import EntitySrv from "@/modules/core/services/EntitySrv";
// const
import { CONTENT_FIELD_DESC } from "@/modules/project/const/const-ticket";
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

	emits: ["imageSelectionToggle"],

	data() {
		return {
			showPreview: false,
			previewImage: null,

			fieldDesc: null,
			selection: null,

			currSelection: null,

		}
	},

	computed: {

		// =============================================

		availableImages() {
			const allImages = EntitySrv.getItems("content")
			const selectedIds = this.images.map(i =>  Number(i.id));
			const notSelectedImages = allImages.filter(image => !selectedIds.includes(Number(image.id)));
			return notSelectedImages;
		},

	},

	beforeMount() {
		for (const img of this.images) {
			ContentSrv.addDataUrlValue(img);
		}
	},

	mounted() {
		this.currSelection = this.images.map(img => Number(img.id));
	},

	methods: {

		...mapActions("entity", ["loadTables", "updateItem"]),
		...mapMutations("core", ["INCREMENT_KEY"]),

		openPreview(id) {
			const imageToOpen = this.images.find(img => Number(img.id) === Number(id));
			if (imageToOpen) {
				this.previewImage = imageToOpen;
				this.showPreview = true;
			}
		},

		async openEntityPicker() {
			const ids = this._getLinkedIds();
			this.fieldDesc = await this._getFieldDesc();
			this.$refs.modal_ref.open();
			nextTick(() => this.$refs.ent_picker_ref.setValue(ids.join(":")));
		},

		// =============================================

		onCheckboxChange(id) {
			// console.log("selection on image", id, "toggled")
			if (this.currSelection.includes(Number(id))) {
				this.currSelection = this.currSelection.filter(imageId => Number(imageId) !== Number(id));
			} else {
				this.currSelection.push(Number(id))
			}
		},

		onRemoveImage(id) {
			console.log("onRemoveImage", id)
			this.onCheckboxChange(id);
			this.saveChanges();
		},

		onValueUpdate(selectedIds) {
			this.selection = selectedIds
		},



		// ============================================= CURRENT VALUES

		_getLinkedIds() {
			return this.images.map(i => i.id);
		},

		// ============================================= SAVE CHANGES

		async saveChanges() {
			const srcTicket = EntitySrv.getItemById("ticket", this.$route.params.id);

			if (!srcTicket) return;

			const updatedTicket = {
				...srcTicket,
				// content: String(this.selection)
				content: this.currSelection.join(":")
			};

			console.log("updatedTicket", JSON.stringify(updatedTicket))

			await this.updateItem({
				tableName: "ticket",
				item: updatedTicket,
			})
			await this.loadTables(["ticket"]);

			this.INCREMENT_KEY();
			this.$refs.modal_ref.close();
		},

		onCancel() {
			this.$refs.modal_ref.close();
		},
		// =============================================



		async _getFieldDesc() {
			const options = await ContentSrv.getContentItems();
			return CONTENT_FIELD_DESC(options);
		}

	},

}
</script>



