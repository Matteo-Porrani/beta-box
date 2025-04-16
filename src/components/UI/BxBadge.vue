
<template>
	<div
		class="rounded p-1 w-fit min-w-20 text-center text-sm text-stone-800"
		:class="bgColorClass"
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
	},

	computed: {
		bgColorClass() {
			if (!this.color || !this.shade) return "bg-stone-500";
			return `bg-${this.color}-${this.shade}`;
		}
	}
}
</script>



