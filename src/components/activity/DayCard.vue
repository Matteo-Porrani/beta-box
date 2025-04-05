<template>
	<div
		data-test="day-card-root"
		class="border border-stone-500 rounded p-2"
	>
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-xl font-bold">{{ dayTitle }}</h3>
			<span class="text-sm text-stone-400">{{ formattedDate }}</span>
		</div>
		<div class="space-y-2">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: "DayCard",

	props: {
		date: {
			type: [String, Date],
			required: true
		},
		title: {
			type: String,
			default: "Today"
		}
	},

	data() {
		return {
			// Component data properties
		}
	},

	computed: {
		formattedDate() {
			if (!this.date) return "";
			const date = new Date(this.date);
			return date.toLocaleDateString();
		},

		dayTitle() {
			return this.title;
		}
	},


	watch: {
		// Component watchers
	},

	mounted() {
		// Component mounted hook
	},

	methods: {
		// Component methods
	},

}
</script>

<style scoped>
/* Component specific styles */
</style> 