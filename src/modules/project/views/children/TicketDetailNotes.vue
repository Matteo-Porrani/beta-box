
<template>
	<section>
		<template v-if="!showForm">
			<div class="space-y-4">
				<NoteItem
					v-for="n in notes"
					:key="n.id"
					:note-item="n"
					@edit-note="onEditNote"
					@delete-note="onDeleteNote"
				/>
			</div>

			<div class="h-2"/>

			<button
				class="
					py-1 px-2 flex items-center justify-center gap-1 text-xs font-medium
					text-stone-400 bg-stone-800 hover:bg-stone-700 border border-stone-700
					rounded transition-colors
				"
				@click="onEditNote(-1)"
			>
				<BxIcon icon="add"/>
			</button>

			<div class="h-10"/>
		</template>

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
		onEditNote(id = null) {
			this.formNoteId = id;
			this.showForm = true;
		},

		onCloseForm() {
			this.formNoteId = -1;
			this.showForm = false;
		},

		// =============================================

		async onSaveNote(data) {
			await NotesSrv.saveNote(data);
			this.onCloseForm();
		},

		async onDeleteNote(id) {
			await NotesSrv.deleteNote(id);
		}
	}

}
</script>



