<template>

	<BxModal
		ref="modal_ref"
	>
		<template #body>
			<BxEntityPicker
				ref="ent_picker_ref"
				:field-desc="fieldDesc"
				entity="Content"
				:multiple="fieldDesc.multiple"
				@update:model-value="onValueUpdate"
			/>
		</template>

		<template #footer>
			<BxButton
				label="Save"
				@click="saveChanges"
			/>
		</template>
	</BxModal>

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

import { nextTick } from "vue";
import ContentSrv from "@/modules/core/services/ContentSrv";
import { dataSrv } from "@/modules/core/services/DataSrv";
import EntitySrv from "@/modules/core/services/EntitySrv";
// components
import TheFullscreenPreview from "@/modules/core/components/layout/TheFullscreenPreview.vue";
import { mapActions, mapMutations } from "vuex";

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

			fieldDesc: null,
			selection: null,
		}
	},

	beforeMount() {
		for (const img of this.images) {
			ContentSrv.addDataUrlValue(img);
		}
	},

	methods: {

		...mapActions("entity", ["loadItems"]),
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

		onValueUpdate(selectedIds) {
			this.selection = selectedIds
		},

		async saveChanges() {
			const srcTicket = EntitySrv.getItems("ticket").find(t => Number(t.id) === Number(this.$route.params.id))
			if (!srcTicket) return;

			const updatedTicket = {
				...srcTicket,
				content: String(this.selection)
			};

			// UPDATE
			await dataSrv.update("ticket", updatedTicket);
			await dataSrv.load("ticket");
			await this.loadItems("ticket");

			this.INCREMENT_KEY();
			this.$refs.modal_ref.close();
		},
		// =============================================

		_getLinkedIds() {
			return this.images.map(i => i.id);
		},

		async _getFieldDesc() {
			return {
				"entity": "Ticket",
				"pk": false,
				"readonly": false,
				"picker_col": false,
				"required": false,
				"type": "E",
				"multiple": true,
				"field": "content",
				"rel_entity": "Content",
				"max": "",
				"options": await ContentSrv.getContentItems(),
				"entityPickerCols": [ "id", "name" ],
				"order": 1,
				"id": 1
			}
		}

	},

}
</script>



