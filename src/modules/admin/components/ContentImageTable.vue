<template>
	<section
		v-if="images"
		class="max-h-[80vh] bx-scrollbar"
	>

		<input
			ref="filterInput_ref"
			type="text"
			v-model="needle"
			class="bg-stone-700 rounded text-stone-200 p-2 w-96 text-lg"
		>

		<div class="h-4"/>

		<article
			v-for="i in filteredList"
			:key="i.id"
			class="grid grid-cols-12 items-center border border-stone-500 rounded mb-1 py-0.5"
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
				class="block w-20 h-8 rounded overflow-hidden"
				@click="openPreview(i.id)"
			>
				<img :src="i.dataUrl" alt="thumbnail" class="object-cover" />
			</button>

			<!-- (3) SPAN-8 -->
			<div class="col-span-8 flex items-center gap-2">
				<p class="font-mono">{{ i.name }}</p>

				<BxBadge
					v-if="i.linked"
					label="linked"
					color="yellow"
					shade="400"
					size="small"
				/>
			</div>

			<!-- (4) -->
			<p>{{ i.size }}</p>

			<!-- (5) -->
			<div class="flex gap-2 justify-end px-2">

				<template v-if="showActions">
					<BxIconButton
						size="small"
						icon="download"
						@click="downloadItem(i.id)"
					/>
					<BxIconButton
						size="small"
						type="danger"
						icon="trash"
						@click="deleteItem(i.id)"
					/>
				</template>

			</div>
		</article>
	</section>
</template>


<script>
import { filterTableByNeedle } from "@/modules/core/utils/table-utils";

export default {
	name: "ContentImageTable",

	props: {
		images: Array,
		showCheckbox: {
			type: Boolean,
			default: false,
		},
		showActions: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		"deleteItem",
		"downloadItem",
		"thumbnailClicked",
		"checkboxChange"
	],

	data() {
		return {
			needle: "",
		}
	},

	computed: {
		filteredList() {
			return filterTableByNeedle(this.images, this.needle, "name")
		}
	},

	mounted() {
		this.$refs.filterInput_ref.focus();
	},

	methods: {
		openPreview(id) {
			this.$emit("thumbnailClicked", id);
		},

		deleteItem(id) {
			this.$emit("deleteItem", id);
		},

		downloadItem(id) {
			this.$emit("downloadItem", id);
		},

		onCheckboxChange(id) {
			this.$emit("checkboxChange", id)
		}
	},

}
</script>


