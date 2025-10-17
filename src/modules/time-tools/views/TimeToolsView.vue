<template>
	<DefaultLayout view-title="Time Tools">
		<div class="grid gap-6">
			<!-- Current Time Display -->
			<div class="bg-stone-700 rounded-lg px-6 py-3 flex items-center gap-8">
				<h2 class="text-lg font-semibold">Current Time</h2>
				<div class="flex items-center gap-6 text-stone-300">
					<span class="font-mono">{{ currentTime }}</span>
					<span class="text-stone-500">|</span>
					<span>{{ currentDate }}</span>
				</div>
			</div>

			<!-- Timestamp Parser -->
			<div class="bg-stone-700 rounded-lg p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-semibold">Timestamp Parser</h2>
					<div class="flex items-center gap-2">
						<button
							@click="removeRow"
							class="w-10 h-10 bg-stone-600 hover:bg-stone-500 rounded flex items-center justify-center font-bold text-xl transition-colors"
							:disabled="rows.length <= 1"
							:class="{ 'opacity-50 cursor-not-allowed': rows.length <= 1 }"
						>
							-
						</button>
						<span class="text-lg font-mono w-8 text-center">{{ rows.length }}</span>
						<button
							@click="addRow"
							class="w-10 h-10 bg-stone-600 hover:bg-stone-500 rounded flex items-center justify-center font-bold text-xl transition-colors"
						>
							+
						</button>
						<span class="text-sm text-stone-400 ml-2">number of rows</span>
					</div>
				</div>

				<!-- Column Headers -->
				<div class="grid grid-cols-12 gap-4 mb-3 text-sm font-medium text-stone-400">
					<div class="col-span-3">timestamp</div>
					<div class="col-span-3">DD/MM/YY HH:MM:SS</div>
					<div class="col-span-6">description</div>
				</div>

				<!-- Rows -->
				<div class="space-y-3">
					<div
						v-for="row in rows"
						:key="row.id"
						class="grid grid-cols-12 gap-4"
					>
						<!-- Timestamp Input -->
						<input
							v-model="row.timestamp"
							type="text"
							class="col-span-3 bg-stone-600 border border-stone-500 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-sky-500 transition-colors"
							@input="parseTimestamp(row)"
						/>

						<!-- Formatted Output -->
						<div class="col-span-3 bg-stone-800 border border-stone-600 rounded px-3 py-2 flex items-center">
							<span
								v-if="row.formatted"
								class="text-stone-200 font-mono"
							>
								{{ row.formatted }}
							</span>
							<span
								v-else-if="row.error"
								class="text-red-400 text-sm"
							>
								{{ row.error }}
							</span>
							<span
								v-else
								class="text-stone-500 text-sm"
							>
								-
							</span>
						</div>

						<!-- Description Input -->
						<input
							v-model="row.description"
							type="text"
							class="col-span-6 bg-stone-600 border border-stone-500 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-sky-500 transition-colors"
						/>
					</div>
				</div>
			</div>
		</div>
	</DefaultLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DefaultLayout from '@/modules/core/components/layout/DefaultLayout.vue';

// ============================================= CURRENT TIME
const currentTime = ref('');
const currentDate = ref('');

const updateTime = () => {
	const now = new Date();
	currentTime.value = now.toLocaleTimeString('fr-FR');
	currentDate.value = now.toLocaleDateString('fr-FR', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

let intervalId = null;

// ============================================= TIMESTAMP PARSER
let nextId = 1;

const createEmptyRow = () => ({
	id: nextId++,
	timestamp: '',
	formatted: '',
	error: '',
	description: ''
});

const rows = ref([
	createEmptyRow(),
	createEmptyRow(),
	createEmptyRow()
]);

const addRow = () => {
	rows.value.push(createEmptyRow());
};

const removeRow = () => {
	if (rows.value.length > 1) {
		rows.value.pop();
	}
};

const parseTimestamp = (row) => {
	// Reset previous values
	row.formatted = '';
	row.error = '';

	// If empty, just return
	if (!row.timestamp || row.timestamp.trim() === '') {
		return;
	}

	// Try to parse as number
	const timestamp = Number(row.timestamp);

	// Validate
	if (isNaN(timestamp)) {
		row.error = 'Invalid timestamp';
		return;
	}

	// Check if it's a reasonable timestamp (not too old, not too far in future)
	// JavaScript timestamps are in milliseconds
	// Valid range: roughly year 1970 to 2100
	if (timestamp < 0 || timestamp > 4102444800000) {
		row.error = 'Timestamp out of range';
		return;
	}

	// Try to create date
	try {
		const date = new Date(timestamp);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			row.error = 'Invalid date';
			return;
		}

		// Format as DD/MM/YY HH:MM:SS
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear()).slice(-2);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		row.formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
	} catch (e) {
		row.error = 'Error parsing timestamp';
	}
};

// ============================================= LIFECYCLE
onMounted(() => {
	updateTime();
	intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
	if (intervalId) {
		clearInterval(intervalId);
	}
});
</script>

