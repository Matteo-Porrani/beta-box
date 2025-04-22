<template>
	<article>

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


			<!-- CONTROLS -->
			<div class="ms-auto flex gap-2 items-center">

				<template v-if="open">
					<div class="flex gap-2 items-center">
						<span class="text-xs">A</span>
						<BxSwitch v-model="bigFont"/>
						<span class="text-lg">A</span>
					</div>

					<div class="flex gap-2 items-center ms-8">
						<BxSwitch v-model="jsSyntax"/>
						<span>JS</span>
					</div>
				</template>

				<button
					class="hover:text-red-500 ms-8"
					@click="deleteNote"
				>
					<BxIcon icon="trash" size="small"/>
				</button>

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
				:font-size="fontSize"
			/>
		</div>

	</article>
</template>


<script>
import BxIcon from "@/components/UI/BxIcon.vue";
import BxSwitch from "@/components/UI/BxForm/fields/BxSwitch.vue";
import NoteContent from "@/modules/project/components/notes/NoteContent.vue";

export default {
	name: "NoteItem",
	components: { BxSwitch, NoteContent, BxIcon },

	props: {
		noteItem: Object
	},

	emits: ["editNote", "deleteNote"],

	data() {
		return {
			open: true,
			bigFont: false,
			jsSyntax: false,
		}
	},

	computed: {
		toggleIconClass() {
			return this.open ? "rotate-90" : "-rotate-90";
		},

		contentLang() {
			return this.jsSyntax ? "javascript" : "text";
		},

		fontSize() {
			return this.bigFont ? "16px" : "11px";
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
-rotate-90
 */
</style>
