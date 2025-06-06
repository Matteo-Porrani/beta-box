<template>
	<DefaultLayout view-title="Data Manager">
		<div
			data-test="data-manager-view-root"
			class="grid grid-cols-2 gap-4 h-[70vh]"
		>

			<!-- EXPORT -->
			<div class="backup border border-stone-500 rounded p-4">
				<BxIconButton
					icon="data_export"
					label="Full Data Backup"
					@click="exportData"
				/>

				<div class="h-8"/>

				<ExportSelectorTable
					v-if="listOfTableNames"
					:list="listOfTableNames"
					@export-table="onExportTable"
				/>
			</div>

			<!-- IMPORT -->
			<div class="import border border-stone-500 rounded p-4">

				<BxIconButton
					type="accent"
					icon="sparkles"
					label="Init Data"
					@click="initData"
				/>

				<div class="h-4"></div>

				<h2 class="mt-8 mb-2">Import</h2>

				<!--
				We hide the native file input (using `hidden`) because it's hard to style consistently across browsers.
				Instead, we use a styled <label> with a `for` attribute pointing to the input's ID.
				This allows us to create a custom-looking button that still triggers the file picker.
				-->
				<div class="flex items-center space-x-4">
					<label
						for="file-upload"
						class="cursor-pointer bg-sky-500 text-stone-800 hover:bg-sky-700 rounded px-2 py-1"
					>
						Upload File
					</label>
					<input
						id="file-upload"
						type="file"
						accept=".txt"
						class="hidden"
						@change="prepareJsonData"
					/>
				</div>

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

					<BxIconButton
						icon="file_import"
						label="Import tables"
						@click="importTables"
					/>

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
// utils
import { nrm } from "@/modules/core/utils/core-utils";

// components
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import ExportSelectorTable from "@/modules/data-manager/components/ExportSelectorTable.vue";


export default {
	name: 'DataManagerView',

	components: {
		ExportSelectorTable,
		DefaultLayout,
	},

	data() {
		return {
			listOfTableNames: null,
			uploadedData: null,
		}
	},

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
		})
	},

	async mounted() {
		await this.initScreen()
	},

	methods: {

		async initScreen() {
			const listOfTables = await dataSrv.getListOfTables()

			if (Array.isArray(listOfTables) && listOfTables.length > 0) {
				this.listOfTableNames = listOfTables.map(t => t.name).sort((a, b) => a.localeCompare(b))
			}
		},


		// =============================================
		// EXPORT
		// =============================================

		exportData() {
			ExportSrv.downloadJson(this.entities);
		},

		onExportTable(table) {
			ExportSrv.downloadJson(this.entities[table], table);
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
				// Fetch and store initialization data from 'public' folder
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


