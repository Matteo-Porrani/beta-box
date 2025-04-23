
<template>
	<section>

		<div class="bg-stone-700 flex gap-2 text-sm rounded py-1 px-2">

			<button
				v-for="b in [['expand', true], ['collapse', false]]"
				:key="b[0]"
				class="hover:text-lime-500"
				@click="_setValueOnAll({ key: 'open', value: b[1] })"
			>
				<BxIcon :icon="b[0]"/>
			</button>
		</div>

		<div class="h-2"/>

		<template v-if="!showForm">
			<div class="space-y-2">
				<NoteItem
					v-for="n in notes"
					:key="n.id"
					:note-item="n"
					:display="notesDisplay[n.id]"
					@edit-note="onEditNote"
					@delete-note="onDeleteNote"
					@display-change="onDisplayChange"
				/>
			</div>

			<div class="h-2"/>

			<button
				class="text-stone-500 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded transition-all p-1"
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
			notesDisplay: {}
		}
	},

	beforeMount() {
		for (const n of this.notes) {
			this._initNoteDisplay(n.id);
		}
	},

	methods: {

		_initNoteDisplay(id) {
			this.notesDisplay[id] = {
				open: false,
				lang: false, // true means JS
				size: false,
			}
		},

		_setValueOnAll({ key, value}) {
			for (const id of this.notes.map(n => n.id)) {
				this.onDisplayChange({ id, key, value });
			}
		},

		onDisplayChange({ id, key, value }) {
			if (this.notesDisplay[id]) {
				this.notesDisplay[id][key] = value;
			}
		},

		onEditNote(id = null) {
			// FIXME -- handling of new notes to be reviewed
			if (id < 0) {
				this._initNoteDisplay(new Date().getTime())
			}
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



