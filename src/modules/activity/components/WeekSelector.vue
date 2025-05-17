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
	<div class="grid grid-cols-3 mb-4">

		<div class="flex justify-start items-center">
			<BxIconButton
				type="soft"
				icon="calendar"
				label="Calendar Manager"
				@click="openManager('calendar')"
			/>
		</div>

		<BxOptionSelector
			v-if="selectOptions"
			:select-options="selectOptions"
			:init-value="initValue"
			@option-selected="onOptionSelected"
		/>

		<div class="flex justify-end items-center">
			<BxIconButton
				type="soft"
				icon="sprint"
				label="Sprint Manager"
				@click="openManager('sprint')"
			/>
		</div>
	</div>
</template>


<script>
import { weekSrv } from "@/modules/activity/services/WeekSrv";

export default {
	name: "WeekSelector",
	components: {  },

	data() {
		return {
			selectOptions: null,
			initValue: null,
		}
	},

	mounted() {
		this.selectOptions = weekSrv.getWeekOptions();
		this.initValue = Array.isArray(this.selectOptions) && this.selectOptions.length > 0
			? this.selectOptions.at(-1).id // this is a row id, not and index
			: 1;
	},

	methods: {
		onOptionSelected(weekId) {
			this.$emit("weekSelected", weekId);
		},

		openManager(key) {
			this.$router.push({ name: `activity_${key}_manager` })
		}
	}
}
</script>


