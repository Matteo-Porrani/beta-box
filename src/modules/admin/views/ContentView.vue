<template>
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
			await ClipboardSrv.pasteClipboardContent();
			this.localKey++;
		},

		async deleteItem(id) {
			await ContentSrv.deleteItem(id);
			this.localKey++;
		}

	}
};
</script>


<style scoped>

</style>
