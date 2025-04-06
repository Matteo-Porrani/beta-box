<template>
	<DefaultLayout view-title="Home">
		<div class="p-5">
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
		</div>
	</DefaultLayout>
</template>

<script>
import { mapState } from "vuex";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";


export default {
	name: 'HomeView',

	components: {
		DefaultLayout,
	},

	data() {
		return {
			needsInitialization: false
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
		}
	}
};
</script>

<style scoped></style>

