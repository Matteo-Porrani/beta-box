/**
* WeekSelector is a component that provides a dropdown interface for selecting weeks.
*
* This component:
* - Displays a list of available weeks using BxOptionSelector
* - Automatically initializes with the most recent week selected
* - Communicates week selection changes to parent ActivityView
*
* Features:
* - Uses weekSrv to fetch and format week options
* - Defaults to the last available week on mount
* - Emits 'weekSelected' event with the selected week ID
*
* Events:
* - weekSelected: Emitted when a week is selected, providing the week ID
*
* Dependencies:
* - BxOptionSelector: UI component for displaying selectable options
* - weekSrv: Manages week data and formatting
*/

<template>
	<div class="grid place-content-center mb-4">
		<BxOptionSelector
			v-if="selectOptions"
			:select-options="selectOptions"
			:init-value="initValue"
			@option-selected="onOptionSelected"
		/>
	</div>
</template>


<script>
import { weekSrv } from "@/service/WeekSrv";
import BxOptionSelector from "@/components/UI/BxOptionSelector.vue";

export default {
	name: "WeekSelector",
	components: { BxOptionSelector },

	data() {
		return {
			selectOptions: null,
			initValue: null,
		}
	},

	mounted() {
		this.selectOptions = weekSrv.getWeekOptions();
		this.initValue = Array.isArray(this.selectOptions) && this.selectOptions.length > 0
			? this.selectOptions.at(-1).id
			: 1;
	},

	methods: {
		onOptionSelected(weekId) {
			this.$emit("weekSelected", weekId);
		}
	}
}
</script>


