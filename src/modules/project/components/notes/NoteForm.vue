<template>
	<div>
		<input
			v-model="title"
			type="text"
			class="w-full mb-2"
		>

		<textarea
			v-model="content"
			class="w-full h-[50vh] resize-none font-mono mb-2"
		></textarea>

		<div class="flex justify-between">
			<button @click="closeForm">Cancel</button>
			<button @click="saveNote">OK</button>
		</div>
	</div>
</template>


<script>
import NotesSrv from "@/modules/project/services/NotesSrv";

export default {
	name: "NoteForm",

	props: {
		noteId: Number
	},

	emits: ["closeForm", "saveNote"],

	data() {
		return {
			id: null,
			title: "",
			content: "",
		}
	},

	beforeMount() {
		if (this.noteId && this.noteId > 0) {
			const n = NotesSrv.getNoteById(this.noteId)
			this.initForm(n);
		} else {
			this.title = "Note " + new Date().toLocaleString().slice(0, -3);
		}
	},

	methods: {
		initForm(n) {
			this.id = n.id;
			this.title = n.title;
			this.content = n.content;
		},

		closeForm() {
			this.$emit("closeForm");
		},

		saveNote() {
			this.$emit("saveNote", {
				id: this.id,
				title: this.title,
				content: this.content,
				ticket: this.$route.params.id,
			})
		}
	}

}
</script>


<style scoped>
input,
textarea,
select {
	@apply block bg-stone-700 rounded text-stone-200 p-1
}

button {
	@apply bg-stone-700 hover:bg-stone-600 w-24 py-1 rounded
}
</style>
