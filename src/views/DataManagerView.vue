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
import { activitySrv } from "@/services/ActivitySrv";
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

		async initData() {
			await this.uploadJson(null, true);
		},

		async uploadJson(e, fromInit = false) {
			let file;

			if (e && !fromInit) {
				file = e.target.files[0];
			}

			if (file) {
				const reader = new FileReader();
				reader.onload = async (e) => {
					try {

						if (e && !fromInit) {
							const json = JSON.parse(e.target.result);
							console.log("IMPORTING data", json);

							this.uploadedData = json;
						} else {
							this.uploadedData = await fetch('/data-init/beta_box_init.txt').then(r => r.json());
						}

					} catch(e) {
						console.error(e);
					}
				};

				reader.readAsText(file);
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

