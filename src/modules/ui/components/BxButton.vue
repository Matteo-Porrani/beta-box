<template>
	<button
		:class="btnClass"
	>
		<slot/><!-- #default -->
		{{ label }}
		<slot name="rightSlot"/>
	</button>
</template>


<script>
export default {
	name: "BxButton",

	props: {
		text: Boolean,
		label: String,
		type: {
			type: String,
			default: "primary"
		},
		size: String,
		noMinWidth: Boolean
	},

	computed: {
		btnClass() {
			// console.log(`${this.borderClass} ${this.bgClass} ${this.textSizeClass} ${this.dimClass}`)
			return `${this.borderClass} ${this.bgClass} ${this.textSizeClass} ${this.dimClass}`
		},

		textSizeClass() {
			return this.size === "small" ? "text-sm" : ""
		},

		dimClass() {
			const minWidthClass = this.noMinWidth ? "" : (this.size === "small" ? "min-w-10" : "min-w-24");
			const heightClass = this.size === "small" ? "h-6 px-1" : "py-1 px-2";
			return `${heightClass} ${minWidthClass}`;
		},

		bgClass() {
			if (this.text) {
				const textMap = {
					primary: "hover:text-sky-500",
					secondary: "hover:text-stone-400",
					danger: "hover:text-pink-600",
					accent: "hover:text-yellow-500",
				}

				return textMap[this.type];
			} else {
				const bgMap = {
					primary: "bg-sky-500 hover:bg-sky-400 text-stone-800",
					secondary: "hover:bg-stone-700 text-stone-400",
					danger: "bg-pink-700 hover:bg-pink-600 text-stone-800",
					accent: "bg-yellow-400 hover:bg-yellow-300 text-stone-800",
					soft: "bg-stone-700 hover:bg-stone-600 text-stone-400",
				}

				return bgMap[this.type];
			}
		},

		borderClass() {
			if (this.text) return "border-transparent";

			const borderMap = {
				primary: "border-sky-500 hover:border-sky-400 border",
				secondary: "border-stone-500 border",
				danger: "border-pink-700 hover:border-pink-600 border",
				accent: "border-yellow-400 hover:border-yellow-300 border",
				soft: "border-stone-700 hover:border-stone-600 border",
			}

			return borderMap[this.type];
		}

	},

}
</script>


<style scoped>
button {
	@apply flex justify-center items-center gap-1 rounded
}

/*
border-sky-500
hover:border-sky-400

border-stone-500

border-pink-700
hover:border-pink-600

border-yellow-400
hover:border-yellow-300
 */
</style>
