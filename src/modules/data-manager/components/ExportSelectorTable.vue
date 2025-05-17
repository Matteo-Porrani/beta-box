<template>
	<section>

		<p class="text-stone-400 mb-2">Export by table</p>
		<BxTable
			:cols="['id', 'table', 'count']"
			:rows="exportTableRows"
			:actions="actions"
			@rowAction="onRowAction"
		/>

	</section>
</template>


<script setup>
// Vue related
import { computed, defineProps, defineEmits } from 'vue'
// services
import EntitySrv from "@/modules/core/services/EntitySrv";
// components
import BxTable from "@/modules/ui/components/BxTable/BxTable.vue";

const $p = defineProps({
	list: Array, // ["color", "ticket", "status", ... ]
})

const $emit = defineEmits(["exportTable"])

const actions = [
	{ name: "export", icon: "arrow_right" }
]

function getCount(tableName) {
	return EntitySrv.getItemsCount(tableName)
}

const exportTableRows = computed(() => {
	return $p.list.map((tableName, index) => {
		return {
			id: index + 1,
			table: tableName,
			count: getCount(tableName)
		}
	});
})



function onRowAction(payload) {
	const { action, data } = payload;

	if (action !== "export") return;
	const { table } = data;
	$emit("exportTable", table)
}
</script>

