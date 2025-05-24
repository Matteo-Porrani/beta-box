<template>
	<DefaultLayout>
		<div class="grid place-content-center py-8">

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

import moment from "moment";
import { DateTime } from "luxon";

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

		const start = DateTime.fromISO("2024-04-21");
		const ref = DateTime.fromISO("2024-04-21");


		console.log("toISO", start.toISO())
		console.log("toISODate", start.toISODate())

		console.log(start < ref);
		console.log(start <= ref);
		console.log(start.toMillis() === ref.toMillis());

		const startDay = DateTime.fromISO("2025-07-01");
		console.log(startDay.daysInMonth);

		[1, 2, 3].forEach(it => {
			console.log("+",it)
			const next = startDay.plus({ days: it })
			console.log(next.toLocaleString())
		})


		/*
		console.log(new Date("2025-01-01").toString()) 					// considered UTC 	=> Wed Jan 01 2025 ❌ 01:00:00 GMT+0100 (heure normale d’Europe centrale)
		console.log(new Date("2025-01-01T00:00:00").toString()) // considered LOCAL => Wed Jan 01 2025 ✅ 00:00:00 GMT+0100 (heure normale d’Europe centrale)
		*/

		console.log(
			// DateTime.fromISO("2025-01-01").toString()
			DateTime.fromISO("2025-01-01").toLocaleString(DateTime.DATETIME_HUGE)
		)

		console.log(
			// DateTime.fromISO("2025-01-01T00:00:00").toString()
			DateTime.fromISO("2025-03-31").toLocaleString(DateTime.DATETIME_HUGE)
		)

		console.log(
			DateTime.fromISO("2025-01-01T00:00:00+01:00").toString()
		)

		console.log(
			DateTime.fromISO("2025-01-01T00:00:00Z").toString()
		)


		/*

		console.log(new Date("2025-01-01T00:00:00"))  // Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d’Europe centrale)

		console.log(new Date("2025-01-01")) 					// Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d’Europe centrale)
		console.log(new Date("2025-01-01T00:00:00Z")) // Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d’Europe centrale)

		console.log(new Date("2025-05-31"))						// Sat May 31 2025 02:00:00 GMT+0200 (heure d’été d’Europe centrale)



		console.log(moment("2025-01-01T00:00:00"))		// Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d’Europe centrale)
		console.log(moment("2025-01-01"))							// Wed Jan 01 2025 00:00:00 GMT+0100 (heure normale d’Europe centrale)
		console.log(moment("2025-01-01T00:00:00Z"))   // Wed Jan 01 2025 01:00:00 GMT+0100 (heure normale d’Europe centrale)

		console.log(moment("2025-05-31"))   					// Sat May 31 2025 00:00:00 GMT+0200 (heure d’été d’Europe centrale)

		 */
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

	}
};
</script>


