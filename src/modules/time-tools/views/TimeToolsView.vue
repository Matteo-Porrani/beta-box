<template>
	<DefaultLayout view-title="Time Tools">
		<div class="grid gap-6">
			<!-- Current Time Display -->
			<div class="bg-stone-700 rounded-lg px-6 py-3 flex items-center gap-8">
				<h2 class="text-lg font-semibold">Current Time</h2>
				<div class="flex items-center gap-6 text-stone-300">
					<span class="font-cc">{{ currentTime }}</span>
					<span class="text-stone-500">|</span>
					<span>{{ currentDate }}</span>
					<span class="text-stone-500">|</span>
					<span class="font-cc">{{ currentUnixTimestamp }}</span>
					<BxIconButton
						@click="copyCurrentTimestamp"
						icon="copy"
						type="soft"
						size="small"
						no-min-width
						title="Copy current timestamp"
					/>
				</div>
			</div>

			<!-- Timestamp Parser -->
			<div class="bg-stone-700 rounded-lg p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-semibold">Timestamp Parser</h2>
					<div class="flex items-center gap-4">
						<BxIconButton
							@click="resetAll"
							icon="refresh"
							label="Reset"
							type="soft"
							title="Reset all fields"
						/>
						<div class="flex items-center gap-2">
							<BxButton
								@click="removeRow"
								label="-"
								type="secondary"
								class="w-10"
								no-min-width
								:disabled="rows.length <= 1"
								:class="{ 'opacity-50 cursor-not-allowed': rows.length <= 1 }"
							/>
							<span class="text-lg w-8 text-center">{{ rows.length }}</span>
							<BxButton
								@click="addRow"
								label="+"
								type="secondary"
								class="w-10"
								no-min-width
							/>
							<span class="text-sm text-stone-400 ml-2">number of rows</span>
						</div>
					</div>
				</div>

				<!-- Column Headers -->
				<div class="timestamp-grid gap-4 mb-3 text-sm font-medium text-stone-400">
					<div></div> <!-- Empty for delete button column -->
					<div>description</div>
					<div class="text-center">#</div>
					<div>timestamp</div>
					<div>DD/MM/YY HH:MM:SS</div>
					<div class="text-center">ref</div>
					<div>distance</div>
				</div>

				<!-- Rows -->
				<div class="space-y-2 font-cc">
					<TimestampConversionRow
						v-for="(row, index) in rows"
						:key="row.id"
						:row="row"
						:row-number="index + 1"
						:all-rows="rows"
						:reference-row-id="referenceRowId"
						@update:description="row.description = $event"
						@update:timestamp="handleTimestampUpdate(row, $event)"
						@update:referenceRowId="handleReferenceUpdate"
						@delete="deleteRow(row.id)"
					/>
				</div>
			</div>
		</div>
	</DefaultLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import TimestampConversionRow from "../components/TimestampConversionRow.vue";

// ============================================= CURRENT TIME
const currentTime = ref("");
const currentDate = ref("");
const currentUnixTimestamp = ref("");

const updateTime = () => {
	const now = new Date();
	currentTime.value = now.toLocaleTimeString("fr-FR");
	currentDate.value = now.toLocaleDateString("fr-FR", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	currentUnixTimestamp.value = Math.floor(now.getTime() / 1000);
};

const copyCurrentTimestamp = async () => {
	try {
		await navigator.clipboard.writeText(currentUnixTimestamp.value.toString());
	} catch (err) {
		console.error("Failed to copy timestamp:", err);
	}
};

let intervalId = null;

// ============================================= TIMESTAMP PARSER
let nextId = 1;

const createEmptyRow = () => ({
	id: nextId++,
	timestamp: "",
	formatted: "",
	error: "",
	distance: "",
	description: "",
	normalizedTimestamp: null
});

const rows = ref([
	{
		id: nextId++,
		timestamp: "1729166147",
		formatted: "",
		error: "",
		distance: "",
		description: "Sample 1",
		normalizedTimestamp: null
	},
	{
		id: nextId++,
		timestamp: "1729169747",
		formatted: "",
		error: "",
		distance: "",
		description: "Sample 2 (+ 60 min)",
		normalizedTimestamp: null
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

const deleteRow = (rowId) => {
	if (rows.value.length > 1) {
		// If deleting the reference row, clear the reference
		if (referenceRowId.value === rowId) {
			referenceRowId.value = null;
		}
		rows.value = rows.value.filter(row => row.id !== rowId);
		calculateDistances();
	}
};

const resetAll = () => {
	// Reset to initial state with 3 empty rows
	nextId = 1;
	rows.value = [
		createEmptyRow(),
		createEmptyRow(),
		createEmptyRow()
	];
	referenceRowId.value = null;
};

const handleTimestampUpdate = (row, newValue) => {
	row.timestamp = newValue;
	parseTimestamp(row);
};

const handleReferenceUpdate = (newValue) => {
	referenceRowId.value = newValue;
	calculateDistances();
};

const parseTimestamp = (row) => {
	// Reset previous values
	row.formatted = "";
	row.error = "";

	// If empty, just return
	if (!row.timestamp || row.timestamp.trim() === "") {
		calculateDistances();
		return;
	}

	// Try to parse as number
	let timestamp = Number(row.timestamp);

	// Validate
	if (isNaN(timestamp)) {
		row.error = "Invalid timestamp";
		calculateDistances();
		return;
	}

	// Detect if timestamp is in seconds (UNIX) or milliseconds (JavaScript)
	// UNIX timestamps are typically < 10 billion (10000000000)
	// This threshold represents: Sun Nov 20 2286 (in seconds) vs Thu Jan 01 1970 (in ms)
	const isUnixSeconds = timestamp < 10000000000;

	// Convert UNIX timestamp (seconds) to JavaScript timestamp (milliseconds)
	if (isUnixSeconds) {
		timestamp = timestamp * 1000;
	}

	// Check if it's a reasonable timestamp (not too old, not too far in future)
	// Valid range: roughly year 1970 to 2100
	if (timestamp < 0 || timestamp > 4102444800000) {
		row.error = "Timestamp out of range";
		calculateDistances();
		return;
	}

	// Try to create date
	try {
		const date = new Date(timestamp);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			row.error = "Invalid date";
			calculateDistances();
			return;
		}

		// Format as DD/MM/YY HH:MM:SS
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = String(date.getFullYear()).slice(-2);
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		row.formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

		// Store the normalized timestamp in milliseconds for distance calculations
		row.normalizedTimestamp = timestamp;

		// Recalculate distances when timestamp changes
		calculateDistances();
	} catch (e) {
		row.error = "Error parsing timestamp";
		calculateDistances();
	}
};

const formatDuration = (milliseconds) => {
	const absMs = Math.abs(milliseconds);
	const seconds = Math.floor(absMs / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	const sign = milliseconds < 0 ? "-" : "+";

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
			row.distance = "";
		});
		return;
	}

	// Find the reference row
	const refRow = rows.value.find(row => row.id === referenceRowId.value);
	if (!refRow || !refRow.timestamp || refRow.error || !refRow.normalizedTimestamp) {
		return;
	}

	const refTimestamp = refRow.normalizedTimestamp;

	// Calculate distance for each row
	rows.value.forEach(row => {
		if (row.id === referenceRowId.value) {
			row.distance = "(ref)";
		} else if (!row.timestamp || row.error || !row.normalizedTimestamp) {
			row.distance = "";
		} else {
			const difference = row.normalizedTimestamp - refTimestamp;
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

<style scoped>
.timestamp-grid {
	display: grid;
	grid-template-columns: 40px 3fr 40px 2fr 2fr 80px 1.5fr;
}
</style>
