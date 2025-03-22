<template>
	<span class="bx-icon-root">
		<component
			:is="currentIcon"
			:size="computedSize"
		/>
	</span>
</template>

<script>
import {defineComponent} from 'vue'
import { ICON_DICT, ICON_SIZE } from "@/utils/icon-utils";

export default defineComponent({
	name: "BxIcon",

	props: {
		icon: {
			type: String,
			required: true,
		},
		size: {
			type: String,
			default: "medium",
		},
	},

	data() {
		return {
			currentIcon: null,
		}
	},

	computed: {
		computedSize() {
			return ICON_SIZE[this.size];
		}
	},

	async mounted() {
		const iconName = ICON_DICT[this.icon]
		if (iconName) {
			const module = await import("@tabler/icons-vue")
			this.currentIcon = module[iconName]
		}
	}
})
</script>

