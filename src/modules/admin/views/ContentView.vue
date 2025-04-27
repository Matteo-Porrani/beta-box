<template>

	<!-- FULLSCREEN PREVIEW -->
	<section
		v-if="showPreview"
		ref="modal_preview_ref"
		class="absolute inset-12 z-50"
	>

		<div
			v-if="preview.dataUrl"
			class="relative rounded overflow-hidden border h-[100%] place-content-center bg-stone-800"
		>
			<BxIconButton
				text
				icon="xmark"
				class="size-12 text-3xl text-stone-400 absolute right-0 top-4"
				@click="showPreview = false"
			/>
			<p class="absolute right-4 bottom-4 bg-stone-800 rounded p-1">{{ preview.fileName }}</p>

			<img
				:src="preview.dataUrl"
				alt="preview"
				class="h-full object-contain mx-auto"
			/>

		</div>
	</section>

	<!-- CREATE MODAL -->
	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<h2 class="font-bold text-3xl">Create file</h2>
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

			<section
				v-if="images"
				class="max-h-[80vh] overflow-y-auto"
			>
				<article
					v-for="i in images"
					:key="i.id"
					class="grid grid-cols-6 items-center border border-stone-500 rounded mb-1 p-1"
				>
					<button
						class="block w-24 h-12 rounded overflow-hidden"
						@click="openPreview(i.id)"
					>
						<img :src="i.dataUrl" alt="thumbnail" class="object-cover" />
					</button>

					<p>{{ i.id }}</p>

					<p class="col-span-2 font-mono">{{ i.name }}</p>

					<div></div>

					<div class="actions flex justify-end gap-4">
						<BxIconButton
							type="danger"
							icon="trash"
							text
							@click="deleteItem(i.id)"
						/>
					</div>

				</article>
			</section>

		</div>
	</DefaultLayout>
</template>


<script>
import ClipboardSrv from "@/modules/core/services/ClipboardSrv";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ContentSrv from "@/modules/core/services/ContentSrv";
import { nextTick } from "vue";


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
			newFileName: "",

			showPreview: false,
			preview: {
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

			nextTick(() => {
				this.$refs.filename_input_ref.focus()
			})
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
			const image = this.images.find(im => Number(im.id) === Number(id))

			this.preview.fileName = image.name;
			this.preview.dataUrl = image.dataUrl;

			this.showPreview = true;
		},
		// =============================================

		async deleteItem(id) {
			await ContentSrv.deleteItem(id);
			this.localKey++;
		}

	}
};
</script>


<style scoped>
input {
	@apply bg-stone-700 rounded text-stone-200 p-1 text-xl
}
</style>
