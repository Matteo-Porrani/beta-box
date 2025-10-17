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
				<div class="grid gap-4 mb-3 text-sm font-medium text-stone-400" style="grid-template-columns: 3fr 40px 2fr 2fr 80px 1.5fr;">
					<div>description</div>
					<div class="text-center">#</div>
					<div>timestamp</div>
					<div>DD/MM/YY HH:MM:SS</div>
					<div class="text-center">ref</div>
					<div>distance</div>
				</div>

				<!-- Rows -->
				<div class="space-y-3">
					<div
						v-for="(row, index) in rows"
						:key="row.id"
						class="grid gap-4 items-center"
						style="grid-template-columns: 3fr 40px 2fr 2fr 80px 1.5fr;"
					>
						<!-- Description Input -->
						<input
							v-model="row.description"
							type="text"
							class="bg-stone-600 border border-stone-500 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-sky-500 transition-colors"
						/>

						<!-- Row Number -->
						<div class="text-center text-stone-200 font-bold text-lg">
							{{ index + 1 }}
						</div>

						<!-- Timestamp Input -->
						<input
							v-model="row.timestamp"
							type="text"
							class="bg-stone-600 border border-stone-500 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-sky-500 transition-colors"
							@input="parseTimestamp(row)"
						/>

						<!-- Formatted Output -->
						<div class="bg-stone-800 border border-stone-600 rounded px-3 py-2 flex items-center">
							<span
								v-if="row.formatted"
								class="text-stone-200 font-mono text-sm"
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

						<!-- Reference Selector -->
						<select
							v-model="referenceRowId"
							@change="calculateDistances"
							class="bg-stone-600 border border-stone-500 rounded px-2 py-2 text-stone-200 text-sm focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
						>
							<option :value="null">-</option>
							<option
								v-for="(r, i) in rows"
								:key="r.id"
								:value="r.id"
								:disabled="!r.formatted"
							>
								{{ i + 1 }}
							</option>
						</select>

						<!-- Distance Display -->
						<div class="bg-stone-800 border border-stone-600 rounded px-3 py-2 flex items-center">
							<span
								v-if="row.distance"
								class="text-stone-200 font-mono text-sm"
							>
								{{ row.distance }}
							</span>
							<span
								v-else
								class="text-stone-500 text-sm"
							>
								-
							</span>
						</div>
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
	distance: '',
	description: ''
});

const rows = ref([
	{
		id: nextId++,
		timestamp: '1729166147000',
		formatted: '',
		error: '',
		distance: '',
		description: 'Sample timestamp 1'
	},
	{
		id: nextId++,
		timestamp: '1729169747000',
		formatted: '',
		error: '',
		distance: '',
		description: 'Sample timestamp 2 (1 hour later)'
	},
	createEmptyRow()
]);

const referenceRowId = ref(null);

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
		calculateDistances();
		return;
	}

	// Try to parse as number
	const timestamp = Number(row.timestamp);

	// Validate
	if (isNaN(timestamp)) {
		row.error = 'Invalid timestamp';
		calculateDistances();
		return;
	}

	// Check if it's a reasonable timestamp (not too old, not too far in future)
	// JavaScript timestamps are in milliseconds
	// Valid range: roughly year 1970 to 2100
	if (timestamp < 0 || timestamp > 4102444800000) {
		row.error = 'Timestamp out of range';
		calculateDistances();
		return;
	}

	// Try to create date
	try {
		const date = new Date(timestamp);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			row.error = 'Invalid date';
			calculateDistances();
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

		// Recalculate distances when timestamp changes
		calculateDistances();
	} catch (e) {
		row.error = 'Error parsing timestamp';
		calculateDistances();
	}
};

const formatDuration = (milliseconds) => {
	const absMs = Math.abs(milliseconds);
	const seconds = Math.floor(absMs / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	const sign = milliseconds < 0 ? '-' : '+';

	if (days > 0) {
		const remainingHours = hours % 24;
		const remainingMinutes = minutes % 60;
		return `${sign}${days}d ${remainingHours}h ${remainingMinutes}m`;
	} else if (hours > 0) {
		const remainingMinutes = minutes % 60;
		const remainingSeconds = seconds % 60;
		return `${sign}${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
	} else if (minutes > 0) {
		const remainingSeconds = seconds % 60;
		return `${sign}${minutes}m ${remainingSeconds}s`;
	} else {
		return `${sign}${seconds}s`;
	}
};

const calculateDistances = () => {
	if (!referenceRowId.value) {
		// Clear all distances if no reference is selected
		rows.value.forEach(row => {
			row.distance = '';
		});
		return;
	}

	// Find the reference row
	const refRow = rows.value.find(row => row.id === referenceRowId.value);
	if (!refRow || !refRow.timestamp || refRow.error) {
		return;
	}

	const refTimestamp = Number(refRow.timestamp);

	// Calculate distance for each row
	rows.value.forEach(row => {
		if (row.id === referenceRowId.value) {
			row.distance = '(ref)';
		} else if (!row.timestamp || row.error) {
			row.distance = '';
		} else {
			const rowTimestamp = Number(row.timestamp);
			const difference = rowTimestamp - refTimestamp;
			row.distance = formatDuration(difference);
		}
	});
};

// ============================================= LIFECYCLE
onMounted(() => {
	updateTime();
	intervalId = setInterval(updateTime, 1000);

	// Parse initial sample timestamps
	rows.value.forEach(row => {
		if (row.timestamp) {
			parseTimestamp(row);
		}
	});
});

onUnmounted(() => {
	if (intervalId) {
		clearInterval(intervalId);
	}
});
</script>

