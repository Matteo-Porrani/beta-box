<template>
	<fieldset>
		<legend>New Task</legend>

		<div class="h-12"></div>

		<label>
			desc
			<input
				class="block w-64 text-xl text-stone-800 rounded p-1"
				v-model="desc" type="text" />
		</label>

		<div class="h-4"></div>

		<label class="inline-flex items-center cursor-pointer">
			<div class="relative">
				<input 
					type="checkbox" 
					class="sr-only peer"
					v-model="starred"
				/>
				<div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
			</div>
			<span class="ml-3 text-sm font-medium">Starred</span>
		</label>

		<div class="h-6"></div>

		<button
			class="bg-teal-500 hover:bg-teal-400 rounded py-2 px-6 text-stone-800"
			@click="addTaskByService"
		>
			Add
		</button>

		<div class="h-4"></div>

		<button
			class="bg-red-500 hover:bg-red-400 rounded py-2 px-6 text-stone-800"
			@click="clearTasks"
		>
			Clear
		</button>

		<p>{{status}}</p>

	</fieldset>
</template>

<script>
// import { db } from "@/service/db"
import { dataSrv } from "@/service/DataSrv";

export default {
	name: 'TaskForm',

	data: () => {
		return {
			status: null,
			desc: "",
			starred: false,
		};
	},

	methods: {

		/* =============================================
			FORM METHODS
			============================================= */

		resetForm() {
			this.desc = null;
		},

		/* =============================================
			CRUD
			============================================= */

		async clearTasks() {
			const res = await dataSrv.clear("task");

			console.log("res", res)
		},

		async addTaskByService() {
			try {

				const newTask = {
					desc: this.desc,
					done: false,
					starred: this.starred,
					dueAt: new Date().getTime() + 1000 * 60 * 60 * 24, // tomorrow at the same time
					tagId: null,
				}

				// const id = await dataSrv.api.task.add(newTask);
				const id = await dataSrv.add("task", newTask);

				this.status = `Task ${this.desc} successfully added. Got id ${id}`;

				this.resetForm();

			} catch (e) {
				console.error(e)
			}
		},


	},
};
</script>


