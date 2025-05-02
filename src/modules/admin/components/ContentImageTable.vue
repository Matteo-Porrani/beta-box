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
			class="grid grid-cols-12 items-center border border-stone-500 rounded mb-1 p-1"
		>

			<!-- (1) -->
			<div class="flex gap-2 justify-center">
				<input
					v-if="showCheckbox"
					type="checkbox"
					@change="onCheckboxChange(i.id)"
				>
				<p>{{ i.id }}</p>
			</div>

			<!-- (2) -->
			<button
				class="block w-24 h-12 rounded overflow-hidden"
				@click="openPreview(i.id)"
			>
				<img :src="i.dataUrl" alt="thumbnail" class="object-cover" />
			</button>

			<!-- (3) SPAN-8 -->
			<p class="font-mono col-span-8">{{ i.name }}</p>

			<!-- (4) -->
			<p>{{ i.size }}</p>

			<!-- (5) -->
			<div class="flex justify-end px-2">
				<BxIconButton
					v-if="showDelete"
					size="small"
					type="danger"
					icon="trash"
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
		showCheckbox: {
			type: Boolean,
			default: false,
		},
		showDelete: {
			type: Boolean,
			default: false,
		},
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
			this.$emit("checkboxChange", id)
		}
	},

}
</script>


