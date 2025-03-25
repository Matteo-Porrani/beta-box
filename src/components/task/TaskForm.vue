<template>
	<div
		data-test="task-form-root"
		class="grid grid-cols-3 gap-4 border border-stone-700 w-1/2 rounded p-4"
	>

		<div class="left col-span-2">
			<p class="font-bold text-xl text-teal-500">{{ taskIdLabel }}</p>

			<label>
				Description
				<input
					v-model="desc"
					type="text"
					class="block w-full text-xl text-stone-800 bg-stone-400 rounded p-1"
				/>
			</label>

			<div class="h-2"></div>

			<label>Due before</label>

			<input
				v-model="dueAtDate"
				type="date"
				class="block w-48 text-xl text-stone-800 bg-stone-400 rounded p-1"
			>

			<div class="h-2"></div>

			<input
				v-model="dueAtTime"
				type="time"
				class="block w-48 text-xl text-stone-800 bg-stone-400 rounded p-1"
			>

			<div class="h-2"></div>

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

			<br>

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
		</div>

		<div class="right flex flex-col justify-between">
			<button
				:disabled="formIsEmpty"
				class="w-full flex items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800"
				@click="resetForm"
			>
				<BxIcon icon="reset" class="-ms-2"/>
				Reset
			</button>
			<button
				:disabled="desc === ''"
				class="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-zinc-700 disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800"
				@click="onSaveButton"
			>
				{{ currTaskId ? 'Update' : 'Add' }}
			</button>
		</div>
	</div>
</template>

<script>
// Vue
import { mapActions, mapGetters } from "vuex";
// Types
import { Task } from "@/types/Task";
import BxIcon from "@/components/UI/BxIcon.vue";

/**
 * @component TaskForm
 * @description A form component for creating and editing tasks. Supports adding new tasks
 * and updating existing ones with description, starred status, and completion status.
 */
export default {
	name: 'TaskForm',
	components: { BxIcon },

	// Expose method for parent components to prefill form
	expose: ["getTaskForPrefill"],

	/**
	 * Component's local state
	 * @returns {Object} Component data
	 * @property {string|null} feedback - Feedback message for form operations
	 * @property {number|null} currTaskId - ID of task being edited, null for new tasks
	 * @property {string} desc - Task description input value
	 * @property {boolean} done - Task completion status
	 * @property {boolean} starred - Task starred status
	 */
	data: () => {
		return {
			feedback: null,
			currTaskId: null,

			desc: "",
			dueAtDate: null,
			dueAtTime: "00:00",
			done: false,
			starred: false,
		};
	},

	computed: {
		...mapGetters("task", [
			"getTaskById",
		]),

		/**
		 * Computes the label for the task form based on whether it's a new task or editing existing
		 * @returns {string} Label indicating if it's a new task or showing existing task ID
		 */
		taskIdLabel() {
			return this.currTaskId
				? `TASK #${this.currTaskId}`
				: "NEW TASK";
		},

		dueAtDateTime() {
			return `${this.dueAtDate}@${this.dueAtTime}`
		},

		formIsEmpty() {
			return this.desc === ""
				&& this.dueAtDate === null
				&& this.dueAtTime === "00:00"
				&& this.done === false
				&& this.starred === false;
		}
	},

	methods: {
		...mapActions("task", [
			"addTask",
			"updateTask",
		]),

		// =============================================
		// FORM HANDLING
		// =============================================

		/**
		 * Prefills the form with existing task data for editing
		 * @param {number} taskId - ID of the task to edit
		 */
		getTaskForPrefill(taskId) {
			this.currTaskId = taskId;
			const task = this.getTaskById(taskId);
			this.initForm(task);
		},

		/**
		 * Initializes form fields with task data
		 * @param {Task} task - Task object containing data to populate the form
		 */
		initForm(task) {
			this.desc = task.desc;
			this.done = task.done;
			this.starred = task.starred;

			if (task.dueAt) {
				const [d, t] = task.dueAt.split("@");
				this.dueAtDate = d;
				this.dueAtTime = t;
			}
		},

		/**
		 * Resets form to initial state after submission or cancellation
		 */
		resetForm() {
			this.currTaskId = null;
			this.desc = "";
			this.starred = false;
			this.dueAtDate = null;
			this.dueAtTime = "00:00";
		},

		// =============================================
		// ADD or UPDATE
		// =============================================

		/**
		 * Handles form submission for both adding new tasks and updating existing ones
		 * Determines the appropriate action based on whether currTaskId exists
		 * @async
		 */
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

		/**
		 * Creates a new Task instance from form data
		 * @param {boolean} withId - Whether to include the current task ID (for updates)
		 * @returns {Task} New Task instance with form data
		 */
		makeTask(withId = false) {
			return new Task({
				id: withId ? this.currTaskId : undefined,
				desc: this.desc,
				dueAt: this.dueAtDate ? this.dueAtDateTime : null,
				done: this.done,
				starred: this.starred,
				tagId: null
			});
		},
	},
};
</script>


