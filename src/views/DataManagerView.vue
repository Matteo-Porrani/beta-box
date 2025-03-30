<template>
	<DefaultLayout view-title="Data Manager">
		<div data-test="data-manager-view-root">

			<pre class="text-xs">{{mock1}}</pre>

			<button
				@click="exportData"
				class="bg-lime-600 hover:bg-lime-500 rounded p-4">Download</button>

		</div>
	</DefaultLayout>
</template>

<script>
import { exportSrv } from "@/service/ExportSrv";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import { mapState } from "vuex";


export default {
	name: 'DataManagerView',

	components: {
		DefaultLayout,
	},

	data() {
		return {
			mock1: [
				{ id: 1, position: "aGT7L65", info: { code: "OK", multiple: false } },
				{
					id: 34,
					position: "WThs20",
					info: { code: "WARN", multiple: true },
					children: [
						{ id: 99 },
						{ id: 263 },
					]

				},
			]
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
		}
	}

};
</script>


<style scoped></style>

