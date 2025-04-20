<template>
	<article class="">

		<div class="flex gap-2 items-center text-sm font-bold text-stone-400 mb-1">
			<button
				class="hover:text-lime-500"
				@click="editNote"
			>
				{{ noteItem.title }}
			</button>

			<button
				class="hover:text-lime-500 ms-auto"
				@click="deleteNote"
			>
				<BxIcon icon="trash" size="small"/>
			</button>
		</div>

<!--		<pre class="border border-stone-500 rounded p-1">{{ noteItem.content  }}</pre>-->
		<pre class="bg-stone-400 text-stone-900 rounded py-1 px-2">{{ noteItem.content  }}</pre>
	</article>
</template>


<script>
import BxIcon from "@/components/UI/BxIcon.vue";

export default {
	name: "NoteItem",
	components: { BxIcon },

	props: {
		noteItem: Object
	},

	emits: ["editNote", "deleteNote"],

	methods: {
		editNote() {
			this.$emit("editNote", this.noteItem.id);
		},

		deleteNote() {
			this.$emit("deleteNote", this.noteItem.id);
		}
	}
}
</script>

