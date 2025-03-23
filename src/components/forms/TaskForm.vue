<template>
	<div data-test="task-form-root" class="border border-stone-700 w-1/2 rounded p-4">
		<p class="font-bold text-xl text-teal-500">{{ taskIdLabel }}</p>

		<label>
			Description
			<input
				v-model="desc"
				type="text"
				class="block w-72 text-xl text-stone-800 bg-stone-400 rounded p-1"
			/>
		</label>

		<div class="h-4"></div>

		<!-- STARRED -->
		<label class="inline-flex items-center cursor-pointer">
			<span class="relative">
				<input 
					type="checkbox" 
					class="sr-only peer"
					v-model="starred"
				/>
				<span
					class="
						block w-11 h-6 bg-stone-400 rounded-full
						peer peer-checked:after:translate-x-full peer-checked:after:border-white
						after:content-[''] after:absolute after:top-[2px] after:left-[2px]
						after:bg-white after:border-gray-300 after:border after:rounded-full
						after:size-5 after:transition-all peer-checked:bg-teal-500"
				></span>
			</span>
			<span class="ml-3 text-sm font-medium">Starred</span>
		</label>

		<div class="h-4"></div>

		<!-- DONE -->
		<label class="inline-flex items-center cursor-pointer">
			<span class="relative">
				<input
					type="checkbox"
					class="sr-only peer"
					v-model="done"
				/>
				<span
					class="
						block w-11 h-6 bg-stone-400 rounded-full
						peer peer-checked:after:translate-x-full peer-checked:after:border-white
						after:content-[''] after:absolute after:top-[2px] after:left-[2px]
						after:bg-white after:border-gray-300 after:border after:rounded-full
						after:size-5 after:transition-all peer-checked:bg-teal-500"
				></span>
			</span>
			<span class="ml-3 text-sm font-medium">Done</span>
		</label>

		<div class="h-6"></div>

		<button
			class="w-36 bg-teal-500 hover:bg-teal-400 rounded py-2 px-6 text-stone-800"
			@click="onSaveButton"
		>
			{{ currTaskId ? 'Update' : 'Add' }}
		</button>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
	name: 'TaskForm',

	expose: ["getTaskForPrefill"],

	data: () => {
		return {
			feedback: null,
			currTaskId: null,

			desc: "",
			done: false,
			starred: false,
		};
	},

	computed: {
		...mapGetters("task", [
			"getTaskById",
		]),

		taskIdLabel() {
			return this.currTaskId ? `TASK #${this.currTaskId}` : "NEW TASK";
		},
	},

	methods: {

		...mapActions("task", [
			"addTask",
			"updateTask",
		]),

		// =============================================
		// FORM HANDLING
		// =============================================

		resetForm() {
			this.currTaskId = null;
			this.desc = null;
			this.starred = false;
		},

		getTaskForPrefill(taskId) {
			console.log("/// getTaskForPrefill")
			this.currTaskId = taskId;
			const task = this.getTaskById(taskId);
			this.prefillForm(task)
		},

		prefillForm(task) {
			this.desc = task.desc;
			this.done = task.done;
			this.starred = task.starred;
		},

		// =============================================
		// ADD or UPDATE
		// =============================================

		async onSaveButton() {
			const action = this.currTaskId ? "$UPDATE" : "$ADD";
			console.log("action", action);

			const execMap = {
				// 		withId		storeAction
				$ADD: [false, "addTask"],
				$UPDATE: [true, "updateTask"],
			}

			const [withId, storeAction] = execMap[action];
			const task = this.makeTask(withId);
			await this[storeAction](task);
			this.resetForm();
		},

		makeTask(withId = false) {
			const t = {
				desc: this.desc,
				done: this.done,
				starred: this.starred,
				dueAt: new Date().getTime() + 1000 * 60 * 60 * 24, // tomorrow at the same time
				tagId: null,
			}

			if (withId) t.id = this.currTaskId;

			return t;
		},

	},
};
</script>


