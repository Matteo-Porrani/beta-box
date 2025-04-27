<template>

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


	<DefaultLayout>
		<div v-if="contentLoaded">

			<div class="text-2xl">Images</div>

			<div class="h-4"/>

			<BxButton
				label="Paste"
				@click="pasteContent"
			/>

			<div class="h-4"/>

			<template v-if="images">
				<article
					v-for="i in images"
					:key="i.id"
					class="grid grid-cols-6 items-center border rounded mb-1 p-1"
				>
					<div class="w-24 h-12 rounded overflow-hidden">
						<img :src="i.dataUrl" alt="thumbnail" class="object-cover" />
					</div>

					<p>{{ i.id }}</p>

					<p class="font-mono">{{ i.name }}</p>

					<div class="actions flex justify-end gap-4">
						<BxIconButton icon="focus" text/>
						<BxIconButton
							type="danger"
							icon="trash"
							text
							@click="deleteItem(i.id)"
						/>
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
			this.localKey++;
		},

		onCancel() {
			this.$refs.modal_ref.close();
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
