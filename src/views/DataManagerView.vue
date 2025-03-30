<template>
	<DefaultLayout view-title="Data Manager">
		<div data-test="data-manager-view-root">

			<button
				@click="exportData"
				class="bg-blue-800 hover:bg-blue-700 rounded py-1 px-2"
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

		uploadJson(e) {
			const file = e.target.files[0];

			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const json = JSON.parse(e.target.result);
						console.log("IMPORTING data", json);

						this.uploadedData = json;
					} catch(e) {
						console.error(e);
					}
				};

				reader.readAsText(file);
			}
		}
	}

};
</script>


<style scoped></style>

