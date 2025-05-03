<template>
	<article>

		<div class="flex gap-2 items-center text-sm font-bold text-stone-40 mb-1 h-8">

			<!-- open/close button -->
			<button
				class="transition-all"
				:class="toggleIconClass"
				@click="toggleOpen"
			>
				<BxIcon icon="angle_right"/>
			</button>

			<!-- title button -->
			<button
				@click="editNote"
			>
				{{ noteItem.title }}
			</button>

			<!-- CONTROLS -->
			<div class="ms-auto flex gap-2 items-center">

				<template v-if="open">

					<div class="flex gap-2 items-center ms-8">
						<BxSwitch v-model="lang"/>
						<span>JS</span>
					</div>
				</template>

				<div class="w-10"/>

				<BxIconButton
					text
					icon="trash"
					type="danger"
					size="small"
					@click="deleteNote"
				/>
			</div>

		</div>

		<!--	CONTENT	-->
		<div
			v-if="open"
			class="ps-8"
		>
			<NoteContent
				v-if="noteItem.content"
				:content="noteItem.content"
				:lang="contentLang"
				:font-size="parsedFontSize"
			/>
		</div>
	</article>
</template>


<script>
import NoteContent from "@/modules/project/components/notes/NoteContent.vue";

export default {
	name: "NoteItem",
	components: {
		NoteContent,
	},

	props: {
		noteItem: Object,
		display: Object,
		fontSize: [String, Number], // 1, 2, 3
	},

	emits: ["editNote", "deleteNote", "displayChange"],

	data() {
		return {
			open: true,
			size: false,
			lang: false,
		}
	},

	computed: {
		toggleIconClass() {
			return this.open ? "rotate-90" : "";
		},

		contentLang() {
			return this.lang ? "javascript" : "text";
		},

		parsedFontSize() {
			const fsMap = {
				1: "11px",
				2: "14px",
				3: "18px",
				4: "24px",
			}

			return fsMap[this.fontSize];
		}
	},

	watch: {
		lang(val) {
			this.$emit("displayChange", { id: this.noteItem.id, key: "lang", value: val })
		},

		display: {
			deep: true,
			handler(val) {
				const { open, lang } = val;
				this.open = open;
				this.lang = lang;
			}
		}
	},

	beforeMount() {
		if (this.display && Object.hasOwn(this.display, "open")) this.open = this.display.open;
		if (this.display && Object.hasOwn(this.display, "lang")) this.lang = this.display.lang;
	},

	methods: {

		toggleOpen() {
			this.open = !this.open;
			this.$emit("displayChange", { id: this.noteItem.id, key: "open", value: this.open })
		},

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
-rotate-90
 */
</style>
