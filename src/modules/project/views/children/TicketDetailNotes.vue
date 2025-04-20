
<template>
	<section
		class=""
	>

		<button
			class="flex items-center gap-1 hover:text-lime-600"
			@click="openNoteForm"
		>
			<BxIcon icon="add"/>
			Add
		</button>

		<div class="h-2"/>

		<NoteForm
			@save-note="onSaveNote"
		/>

	</section>
</template>


<script>

import BxIcon from "@/components/UI/BxIcon.vue";
import NoteForm from "@/modules/project/components/notes/NoteForm.vue";
import NotesSrv from "@/modules/project/services/NotesSrv";

export default {
	name: "TicketDetailNotes",
	components: { NoteForm, BxIcon },

	data() {
		return {
			showForm: false,

			dummyNote: {
				id: 45,
				title: "Hello",
				content: "some little content"
			}
		}
	},


	methods: {
		openNoteForm() {
			console.log("/// openNoteForm")
			this.showForm = true;
		},

		async onSaveNote(data) {
			console.log("/// onSaveNote", data)
			await NotesSrv.saveNote(data)
		}
	}


}
</script>



