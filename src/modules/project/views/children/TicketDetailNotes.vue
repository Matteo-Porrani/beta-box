
<template>
	<section>

		<div class="bg-stone-700 flex gap-4 text-sm rounded py-1 px-2">
			<button class="hover:text-violet-400">Open all</button>
			<button class="hover:text-violet-400">Close all</button>
		</div>

		<div class="h-2"/>

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
import NotesSrv from "@/modules/project/services/NotesSrv";

import BxIcon from "@/components/UI/BxIcon.vue";
import NoteForm from "@/modules/project/components/notes/NoteForm.vue";
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



