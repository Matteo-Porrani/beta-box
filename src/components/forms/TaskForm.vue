<template>
	<div data-test="task-form-root">

		<p class="h-12 bg-stone-700 rounded p-1">{{ feedback }}</p>

		<div class="h-4"></div>

		<label>
			Description
			<input
				v-model="desc"
				type="text"
				class="block w-72 text-xl text-stone-800 bg-stone-400 rounded p-1"
			/>
		</label>

		<div class="h-4"></div>

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

		<div class="h-6"></div>

		<button
			class="bg-teal-500 hover:bg-teal-400 rounded py-2 px-6 text-stone-800"
			@click="addNewTask"
		>
			Add
		</button>
	</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
	name: 'TaskForm',

	data: () => {
		return {
			feedback: null,
			desc: "",
			starred: false,
		};
	},

	methods: {

		...mapActions("task", [
			"addTask"
		]),

		// =============================================
		// FORM HANDLING
		// =============================================

		resetForm() {
			this.desc = null;
			this.starred = false;
		},

		// =============================================
		// CRUD
		// =============================================

		async addNewTask() {
			const newTask = {
				desc: this.desc,
				done: false,
				starred: this.starred,
				dueAt: new Date().getTime() + 1000 * 60 * 60 * 24, // tomorrow at the same time
				tagId: null,
			}

			await this.addTask(newTask);

			this.resetForm();
		},

	},
};
</script>


