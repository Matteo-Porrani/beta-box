<template>
	<DefaultLayout view-title="Data Manager">
		<div
			data-test="data-manager-view-root"
			class="grid grid-cols-2 gap-4 h-[70vh]"
		>

			<div class="backup border border-stone-500 rounded p-4">

				<BxIconButton
					icon="data_export"
					label="Data Backup"
					@click="exportData"
				/>

				<div class="h-4"></div>
			</div>

			<div class="import border border-stone-500 rounded p-4">

				<BxIconButton
					type="accent"
					icon="sparkles"
					label="Init Data"
					@click="initData"
				/>

				<div class="h-4"></div>

				<h2 class="mt-8 mb-2">Import</h2>

				<input
					type="file"
					accept=".txt"
					@change="prepareJsonData"
				>

				<div class="h-4"></div>

				<template v-if="uploadedData">

					<div class="flex gap-2 flex-wrap mb-2">
						<p
							v-for="t in Object.keys(uploadedData)"
							:key="t"
							class="border border-stone-300 text-stone-300 font-mono text-xs rounded px-2 py-1"
						>
							{{ t }}
						</p>
					</div>

					<button
						@click="importTables"
						class="bg-lime-600 hover:bg-lime-500 text-stone-800 rounded py-1 px-2"
					>Import tables</button>

					<div class="h-4"></div>

					<div class="bg-stone-700 max-h-[60vh] overflow-y-auto text-stone-300 text-xs rounded p-2">
						<pre>{{ uploadedData }}</pre>
					</div>
				</template>
			</div>

		</div>
	</DefaultLayout>
</template>


<script>
// Vue related
import { mapState } from "vuex";
// services
import ExportSrv from "@/modules/data-manager/services/ExportSrv";
import { dataSrv } from "@/modules/core/services/DataSrv";
// components
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import { nrm } from "@/modules/core/utils/core-utils";


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

		// =============================================
		// EXPORT
		// =============================================

		exportData() {
			ExportSrv.downloadJson(this.entities);
		},

		// =============================================
		// INIT & IMPORT
		// =============================================

		/**
		 * Initializes the application data by triggering prepareJsonData with initialization parameters
		 */
		async initData() {
			// Call prepareJsonData with null event and fromInit flag set to true
			await this.prepareJsonData(null, true);
		},

		/**
		 * Handles JSON data upload from either file input or initialization
		 * @param {Event|null} e - File input change event or null if called from initData
		 * @param {boolean} fromInit - Flag indicating if called from initialization (true) or file upload (false)
		 */
		async prepareJsonData(e, fromInit = false) {
			let file;

			// Only get file from event if it's a regular upload (not initialization)
			if (e && !fromInit) {
				file = e.target.files[0];
			}

			// Process file if it exists (regular upload path)
			if (file) {
				this._importJsonFromFile(file);
			} else if (fromInit) { // Direct initialization path (no file involved)
				this.uploadedData = await this._importJsonFromInitFile();
			}
		},

		async _importJsonFromInitFile() {
			try {
				// Fetch and store initialization data from public folder
				return await fetch('/data-init/beta_box_init.txt').then(r => r.json());
			} catch(e) {
				console.error(e);
				return {};
			}
		},

		_importJsonFromFile(file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					// Parse and store uploaded JSON file
					this.uploadedData = JSON.parse(e.target.result);
				} catch(e) {
					console.error(e);
				}
			};

			// Start reading the file
			reader.readAsText(file);
		},

		// =============================================
		// EXECUTION
		// =============================================

		async importTables() {
			for (const tableName of Object.keys(this.uploadedData)) {
				for (const row of this.uploadedData[tableName]) {
					// console.log(">>> table", tableName, ">>> row", row.id, row)
					const clone = nrm(row);
					await dataSrv.add(tableName, clone);

					await new Promise(res => setTimeout(res, 500));
				}
			}
		},
	}

};
</script>


<style scoped></style>

