<template>
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
</template>


<script>
export default {
	name: "ContentImageTable",

	props: {
		images: Array,
	},

	emits: ["deleteItem", "thumbnailClicked"],

	data() {
		return {

		}
	},

	methods: {
		openPreview(id) {
			this.$emit("thumbnailClicked", id);
		},

		deleteItem(id) {
			this.$emit("deleteItem", id);
		}
	},

}
</script>


