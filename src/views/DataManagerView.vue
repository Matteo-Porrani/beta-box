<template>
	<DefaultLayout view-title="Data Manager">
		<div data-test="data-manager-view-root">

			<button
				@click="initData"
				class="bg-yellow-400 hover:bg-yellow-300 text-stone-800 rounded py-1 px-2"
			>Init App Data</button>

			<div class="h-4"></div>

			<button
				@click="exportData"
				class="bg-lime-600 hover:bg-lime-500 text-stone-800 rounded py-1 px-2"
			>Backup</button>

			<div class="h-4"></div>

			<input
				type="file"
				accept=".txt"
				@change="uploadJson"
			>

			<div class="h-4"></div>

			<template v-if="uploadedData">

				<pre>{{ JSON.stringify(Object.keys(uploadedData)) }}</pre>

				<button
					@click="importTables"
					class="bg-blue-800 hover:bg-blue-700 rounded py-1 px-2"
				>Import tables</button>

				<div class="h-4"></div>

				<div class="bg-stone-700 max-h-[60vh] overflow-y-auto text-blue-300 text-xs rounded p-2">
					<pre>{{ uploadedData }}</pre>
				</div>
			</template>

		</div>
	</DefaultLayout>
</template>

<script>
// Vue related
import { mapState } from "vuex";
// services
import { exportSrv } from "@/service/ExportSrv";
import { dataSrv } from "@/service/DataSrv";
// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";


export default {
	name: 'DataManagerView',

	components: {
		DefaultLayout,
	},

	data() {
		return {
			uploadedData: null,
		}
	},

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
		})
	},

	methods: {
		exportData() {
			exportSrv.downloadJson(this.entities);
		},

		/**
		 * Initializes the application data by triggering uploadJson with initialization parameters
		 */
		async initData() {
			// Call uploadJson with null event and fromInit flag set to true
			await this.uploadJson(null, true);
		},

		/**
		 * Handles JSON data upload from either file input or initialization
		 * @param {Event|null} e - File input change event or null if called from initData
		 * @param {boolean} fromInit - Flag indicating if called from initialization (true) or file upload (false)
		 */
		async uploadJson(e, fromInit = false) {
			let file;

			// Only get file from event if it's a regular upload (not initialization)
			if (e && !fromInit) {
				file = e.target.files[0];
			}

			// Process file if it exists (regular upload path)
			if (file) {
				const reader = new FileReader();
				reader.onload = async (e) => {
					try {
						// Regular file upload path
						if (e && !fromInit) {
							// Parse and store uploaded JSON file
							const json = JSON.parse(e.target.result);
							console.log("IMPORTING data", json);
							this.uploadedData = json;
						}

					} catch(e) {
						console.error(e);
					}
				};

				// Start reading the file
				reader.readAsText(file);
			}

			// Direct initialization path (no file involved)
			else if (fromInit) {
				try {
					// Fetch and store initialization data from public folder
					this.uploadedData = await fetch('/data-init/beta_box_init.txt').then(r => r.json());
				} catch(e) {
					console.error(e);
				}
			}
		},

		// =============================================
		// EXECUTION
		// =============================================

		async importTables() {
			for (const tableName of Object.keys(this.uploadedData)) {
				console.log(">>> table", tableName)

				for (const row of this.uploadedData[tableName]) {
					console.log(">>> row", row.id, row)
					const clone = JSON.parse(JSON.stringify(row))
					await dataSrv.add(tableName, clone);

					await new Promise(res => setTimeout(res, 500));
				}
			}
		},
	}

};
</script>


<style scoped></style>

