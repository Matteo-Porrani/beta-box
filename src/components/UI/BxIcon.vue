<template>
	<span data-test="bx-icon-root">
		<component
			:data-test="`bx-icon-${icon}`"
			:is="currentIcon"
			:size="computedSize"
		/>
	</span>
</template>

<script>
import { defineComponent } from 'vue'
// Import all icons from @tabler/icons-vue package
// This package provides a comprehensive set of icons that can be used as Vue components
import * as TablerIcons from '@tabler/icons-vue'
import { ICON_DICT, ICON_SIZE } from "@/const/const-icon";

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

	created() {
		// Look up the actual Tabler icon name from our custom ICON_DICT mapping
		const iconName = ICON_DICT[this.icon]
		if (iconName) {
			// Dynamically get the icon component from TablerIcons using the mapped name
			// This allows us to use any icon from the TablerIcons package
			this.currentIcon = TablerIcons[iconName]
		}
	}
})
</script>

