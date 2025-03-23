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
// Vue
import { mapActions, mapGetters } from "vuex";
// Types
import { Task } from "@/types/Task";

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
			return this.currTaskId
				? `TASK #${this.currTaskId}`
				: "NEW TASK";
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

		getTaskForPrefill(taskId) {
			this.currTaskId = taskId;
			const task = this.getTaskById(taskId);
			this.initForm(task);
		},

		initForm(task) {
			this.desc = task.desc;
			this.done = task.done;
			this.starred = task.starred;
		},

		resetForm() {
			this.currTaskId = null;
			this.desc = null;
			this.starred = false;
		},

		// =============================================
		// ADD or UPDATE
		// =============================================

		async onSaveButton() {
			const execMap = {
				$ADD: [false, "addTask"],
				$UPDATE: [true, "updateTask"],
			}

			const action = this.currTaskId ? "$UPDATE" : "$ADD";
			const [withId, storeAction] = execMap[action];
			const task = this.makeTask(withId);
			await this[storeAction](task);
			this.resetForm();
		},

		makeTask(withId = false) {
			return new Task({
				id: withId ? this.currTaskId : undefined,
				desc: this.desc,
				done: this.done,
				starred: this.starred,
				tagId: null
			});
		},

	},
};
</script>


