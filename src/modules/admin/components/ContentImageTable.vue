<!--

this table must be used to select images to add to a ticket
in order to add with custom order

-->


<template>
	<section
		v-if="images"
		class="max-h-[80vh] overflow-y-auto"
	>
		<article
			v-for="i in images"
			:key="i.id"
			class="grid grid-cols-8 items-center border border-stone-500 rounded mb-1 p-1"
		>

			<div class="text-center">
				<input
					type="checkbox"
					@change="onCheckboxChange(i.id)"
				>
			</div>

			<button
				class="block w-24 h-12 rounded overflow-hidden"
				@click="openPreview(i.id)"
			>
				<img :src="i.dataUrl" alt="thumbnail" class="object-cover" />
			</button>

			<p>{{ i.id }}</p>

			<p class="col-span-2 font-mono">{{ i.name }}</p>

			<p class="">{{ i.size }}</p>

			<div class="actions flex justify-end gap-4">
				<BxIconButton
					v-if="showDelete"
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
		showDelete: {
			type: Boolean,
			default: false,
		}
	},

	emits: ["deleteItem", "thumbnailClicked", "checkboxChange"],

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
		},

		onCheckboxChange(id) {
			console.log("toggle", id)
			this.$emit("checkboxChange", id)
		}
	},

}
</script>


