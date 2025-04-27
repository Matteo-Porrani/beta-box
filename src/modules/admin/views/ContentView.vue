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
					class="grid grid-cols-4 border rounded mb-1"
				>
					<div class="size-12 border rounded">
						<img :src="i.dataUrl" alt="thumbnail" />
					</div>

					<div>
						<p>{{ i.id }}</p>
						<p>{{ i.name }} </p>
					</div>

					<div></div>

					<div class="actions flex justify-end gap-4">
						<BxIconButton icon="focus" text/>
						<BxIconButton
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
