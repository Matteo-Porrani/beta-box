<template>
	<div
		class="grid gap-4 items-center"
		style="grid-template-columns: 3fr 40px 2fr 2fr 80px 1.5fr;"
	>
		<!-- Description Input -->
		<input
			:value="row.description"
			@input="$emit('update:description', $event.target.value)"
			type="text"
			class="bg-stone-600 border border-stone-500 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-sky-500 transition-colors"
		/>

		<!-- Row Number -->
		<div class="text-center text-stone-200 font-bold text-lg">
			{{ rowNumber }}
		</div>

		<!-- Timestamp Input -->
		<input
			:value="row.timestamp"
			@input="$emit('update:timestamp', $event.target.value)"
			type="text"
			class="bg-stone-600 border border-stone-500 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-sky-500 transition-colors"
		/>

		<!-- Formatted Output -->
		<div class="flex items-center text-lg px-3 py-2">
			<span
				v-if="row.formatted"
				class="text-stone-200"
			>
				{{ row.formatted }}
			</span>
			<span
				v-else-if="row.error"
				class="text-red-400"
			>
				{{ row.error }}
			</span>
			<span
				v-else
			>
				-
			</span>
		</div>

		<!-- Reference Selector -->
		<select
			:value="referenceRowId"
			@change="$emit('update:referenceRowId', $event.target.value ? Number($event.target.value) : null)"
			class="bg-stone-600 border border-stone-500 rounded px-2 py-2 text-stone-200 text-sm focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
		>
			<option :value="null">-</option>
			<option
				v-for="(r, i) in allRows"
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
				class="text-stone-200 text-sm"
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
</template>

<script>
export default {
	name: "TimestampConversionRow",
	props: {
		row: {
			type: Object,
			required: true
		},
		rowNumber: {
			type: Number,
			required: true
		},
		allRows: {
			type: Array,
			required: true
		},
		referenceRowId: {
			type: Number,
			default: null
		}
	},
	emits: ["update:description", "update:timestamp", "update:referenceRowId"]
};
</script>
