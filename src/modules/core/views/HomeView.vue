<template>
	<DefaultLayout>
		<div class="grid py-8">

			<div
				v-if="needsInitialization"
				class="bg-stone-800 border border-stone-500 rounded-lg p-8 max-w-lg mx-auto my-10 text-center shadow-xl">
				<div class="w-20 h-20 mx-auto mb-6">
					<img src="@/assets/robot-init.svg" alt="Robot initialization icon" class="w-full h-full" />
				</div>
				<h2 class="text-yellow-400 text-xl font-semibold mb-3">App Initialization Required</h2>
				<p class="text-stone-400 mb-6">This application needs to be initialized before you can start using it.</p>
				<button 
					class="bg-yellow-400 text-stone-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
					@click="initializeApp"
				>
					Initialize App
				</button>
			</div>

			<!-- DRAG & DROP DEMO -->
			<!--
			<div v-else class="grid grid-cols-3">
				<div>
					<h2 class="text-2xl font-bold mb-6 text-center">Demo 2</h2>
					<TheDragDropWrapper
						:items="localColors"
						@reorder="handleReorder"
					>
						<template #default="{ item }">
							<DragDemoItem :item="item"/>
						</template>
					</TheDragDropWrapper>
				</div>
			</div>
			-->

			<div
				v-else
				class="flex flex-col items-center"
			>
				<img
					src="@/assets/images/smiling-robot.svg"
					alt="Friendly Robot"
					class="size-56 rounded-full object-cover border border-stone-500"
				/>
				<h1 class="text-4xl font-bold mt-6">Welcome to BetaBox !</h1>
			</div>
		</div>
	</DefaultLayout>
</template>

<script>
import { mapState } from "vuex";
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
/*
import moment from "moment";
import { DateTime } from "luxon";
import TheDragDropWrapper from "@/modules/core/components/TheDragDropWrapper.vue";
import DragDemoItem from "@/modules/core/components/DragDemoItem.vue";
 */

export default {
	name: 'HomeView',

	components: {
		// TheDragDropWrapper,
		// DragDemoItem,
		DefaultLayout,
	},

	data() {
		return {
			needsInitialization: false,
			localColors: [
				{ id: 1, name: 'Red' },
				{ id: 2, name: 'Green' },
				{ id: 3, name: 'Blue' },
				{ id: 4, name: 'Yellow' },
				{ id: 5, name: 'Purple' },
				{ id: 6, name: 'Orange' },
			]
		}
	},

	computed: {
		...mapState({
			tasks: state => state.task.tasks,
		})
	},

	async mounted() {
		await this.checkIfDatabaseExists()

	},

	methods: {
		async checkIfDatabaseExists() {
			const dbName = 'betaBoxDatabase'; // Replace with your database name

			await indexedDB.databases().then(databases => {
				const exists = databases.some(db => db.name === dbName);
				console.log(`Database "${dbName}" ${exists ? 'exists' : 'does not exist'}`);
				this.needsInitialization = !exists;
			}).catch(error => {
				console.error('Error checking databases:', error);
			});
		},

		initializeApp() {
			this.$router.push("/data-manager");
		},

		handleReorder(reorderedItems) {
			this.localColors = reorderedItems;
			console.log('Items reordered:', reorderedItems);
		},

	}
};
</script>


