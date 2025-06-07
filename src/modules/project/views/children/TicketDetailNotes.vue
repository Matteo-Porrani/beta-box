
<template>
	<section class="grid grid-rows-[auto_1fr] overflow-y-hidden">

		<!-- TOOLBAR -->
		<div class="bg-stone-700 flex gap-2 text-sm rounded py-1 px-2">

			<BxIconButton
				v-for="b in [['expand', true], ['collapse', false]]"
				:key="b[0]"
				text
				:icon="b[0]"
				no-min-width
				@click="_setValueOnAll({ key: 'open', value: b[1] })"
			/>

			<div class="w-8"/>

			<div class="flex gap-2 items-center">
				<span class="text-xs">A</span>
				<input
					v-model="fontSize"
					type="range"
					min="1"
					max="4"
					class="accent-sky-500"
				/>
				<span class="text-xl">A</span>
			</div>

		</div>

		<!-- SCROLLABLE SECTION -->
		<div class="mt-1 bx-scrollbar">
			<template v-if="!showForm">
				<div class="space-y-0">
					<NoteItem
						v-for="n in notes"
						:key="n.id"
						:note-item="n"
						:font-size="fontSize"
						:display="notesDisplay[n.id]"
						@edit-note="onEditNote"
						@delete-note="onDeleteNote"
						@display-change="onDisplayChange"
					/>
				</div>

				<div class="h-2"/>

				<BxIconButton
					type="soft"
					icon="add"
					class="ms-8"
					@click="onEditNote(-1)"
				/>

				<div class="h-10"/>
			</template>

			<NoteForm
				v-else
				:noteId="formNoteId"
				:font-size="fontSize"
				@save-note="onSaveNote"
				@close-form="onCloseForm"
			/>
		</div>

	</section>
</template>


<script>
// service
import NotesSrv from "@/modules/project/services/NotesSrv";
// components
import NoteForm from "@/modules/project/components/notes/NoteForm.vue";
import NoteItem from "@/modules/project/components/notes/NoteItem.vue";

export default {
	name: "TicketDetailNotes",
	components: {
		NoteItem,
		NoteForm,
	},

	inject: ["notes"],

	data() {
		return {
			showForm: false,
			formNoteId: -1,
			fontSize: 2,
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
				open: true,
				lang: false, // true means JS
				size: true,
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
			// FIXME -- handling of NEW NOTES to be reviewed
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



