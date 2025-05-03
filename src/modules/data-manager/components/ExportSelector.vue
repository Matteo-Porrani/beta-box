<template>
	<section class="">

		<BxTable
			:cols="['id', 'table', 'count']"
			:rows="exportTablesRows"
			:actions="actions"
			@rowAction="onRowAction"
		/>

	</section>
</template>


<script setup>
import { ref, reactive, computed, defineProps, defineEmits, onMounted } from 'vue'

import EntitySrv from "@/modules/core/services/EntitySrv";
import BxTable from "@/modules/ui/components/BxTable/BxTable.vue";

const $p = defineProps({
	list: Array,
})

const $emit = defineEmits(["exportTable"])

const actions = [
	{ name: "export", icon: "arrow_right" }
]

const exportTables = reactive({});
const exportTablesRows = computed(() => {

	const rows = []
	let id = 1;

	for (const k of Object.keys(exportTables)) {
		rows.push({
			id: id,
			table: k,
			count: exportTables[k]
		})
		id++
	}

	return rows;
})

onMounted(() => {
	for (const t of $p.list) {
		exportTables[t] = getCount(t)
	}
})

function onRowAction(payload) {
	const { action, data } = payload;
	const { table } = data;
	$emit("exportTable", table)
}


function getCount(tableName) {
	return EntitySrv.getItemsCount(tableName)
}

</script>

