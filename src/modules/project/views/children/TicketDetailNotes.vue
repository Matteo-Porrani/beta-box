
<template>
	<section class="">

		<div class="space-y-4">

			<NoteItem
				v-for="n in notes"
				:key="n.id"
				:note-item="n"
			/>
		</div>

		<div class="h-5"></div>

		<button
			v-if="!showForm"
			class="flex items-center gap-1 hover:text-lime-600 ms-auto me-4"
			@click="openNoteForm(-1)"
		>
			<BxIcon icon="add"/>
			Add
		</button>

		<NoteForm
			v-else
			:noteId="formNoteId"
			@save-note="onSaveNote"
			@close-form="onCloseForm"
		/>

	</section>
</template>


<script>

import BxIcon from "@/components/UI/BxIcon.vue";
import NoteForm from "@/modules/project/components/notes/NoteForm.vue";
import NotesSrv from "@/modules/project/services/NotesSrv";
import NoteItem from "@/modules/project/components/notes/NoteItem.vue";

export default {
	name: "TicketDetailNotes",
	components: { NoteItem, NoteForm, BxIcon },

	inject: ["notes"],

	data() {
		return {
			showForm: false,

			formNoteId: -1,
		}
	},

	methods: {
		openNoteForm(id = null) {
			this.formNoteId = id;
			this.showForm = true;
		},

		onCloseForm() {
			this.formNoteId = -1;
			this.showForm = false;
		},

		async onSaveNote(data) {
			await NotesSrv.saveNote(data);
			this.onCloseForm();
		}
	}

}
</script>



