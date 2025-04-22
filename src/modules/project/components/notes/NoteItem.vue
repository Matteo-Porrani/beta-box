<template>
	<article class="">

		<div class="flex gap-2 items-center text-sm font-bold text-stone-400 mb-1">

			<button
				class="transition-all"
				:class="toggleIconClass"
				@click="open = !open"
			>
				<BxIcon icon="angle_left"/>
			</button>

			<button
				class="hover:text-lime-500"
				@click="editNote"
			>
				{{ noteItem.title }}
			</button>

			<button
				class="hover:text-red-500 ms-auto"
				@click="deleteNote"
			>
				<BxIcon icon="trash" size="small"/>
			</button>
		</div>

		<!--	CONTENT	-->
		<div
			v-if="open"
			class="ps-8"
		>
			<pre class="bg-stone-400 text-stone-900 rounded py-1 px-2">{{ noteItem.content  }}</pre>
		</div>

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

	data() {
		return {
			open: true,
		}
	},

	computed: {
		toggleIconClass() {
			return this.open ? "rotate-90" : "-rotate-90";
		}
	},

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


<style>
/*
rotate-90
rotate-180
rotate-270
-rotate-90
 */
</style>
