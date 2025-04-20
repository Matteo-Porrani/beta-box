
<template>
	<section class="">

		<div class="space-y-1">
			<div
				v-for="n in notes"
				:key="n.id"
				class="flex items-center gap-4 border border-stone-500 rounded p-1"
			>

				<button
					class="hover:text-lime-500"
					@click="openNoteForm(n.id)"
				>
					<BxIcon icon="edit"/>
				</button>

				<p>{{ n.title }}</p>
			</div>
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

export default {
	name: "TicketDetailNotes",
	components: { NoteForm, BxIcon },

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



