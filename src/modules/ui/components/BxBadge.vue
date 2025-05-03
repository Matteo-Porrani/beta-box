<template>
	<div
		class="rounded w-fit min-w-16 text-center text-stone-800 px-2"
		:class="`${bgColorClass} ${textSizeClass}`"
	>
		<span>{{ label }}</span>
	</div>
</template>


<script>
export default {
	name: "BxBadge",

	props: {
		label : String,
		color: String,
		shade: [String, Number],
		size: String,
	},

	computed: {
		bgColorClass() {
			if (!this.color || !this.shade) return "bg-stone-500";
			return `bg-${this.color}-${this.shade}`;
		},

		textSizeClass() {
			if (this.size === "small") return "text-xs h-4";
			return "";
		}
	}
}
</script>



