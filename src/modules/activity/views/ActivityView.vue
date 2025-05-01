<template>
	<DefaultLayout>
		<div
			v-if="loadDone"
			class="max-h-[85vh] overflow-y-auto"
		>
			<WeekSelector
				@week-selected="onWeekSelected"
			/>

			<ActivityGrid
				v-if="selectedWeekId"
				:days="activitiesByWeek"
				@add-activity="onAddActivity"
				@edit-activity="onEditActivity"
			/>
		</div>
	</DefaultLayout>

	<!--	ACTIVITY FORM		-->
	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<h2 class="font-bold text-3xl">Activity</h2>
		</template>

		<template #body>

			<BxIconButton
				type="danger"
				icon="trash"
				label="Delete"
				class="ms-auto"
				@click="onDeleteActivity"
			/>

			<div class="h-2"/>

			<BxForm
				ref="bxForm"
				:description="activityFormDesc"
				@field-value-changed="onFieldValueChanged"
			/>

		</template>

		<template #footer>
			<!-- THE BUTTONS -->
			<div class="w-full flex justify-between">

				<BxButton
					type="soft"
					label="Cancel"
					@click="onCancel"
				/>

				<BxButton
					label="Save"
					@click="onSave"
				/>

			</div>
		</template>
	</BxModal>

</template>

<script>
// Vue related
import { nextTick } from "vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
// service
import { activitySrv } from "@/modules/activity/services/ActivitySrv";
// utils
import { isInteger, parseDurationInMin } from "@/modules/core/utils/core-utils";
import { prepareItem } from "@/modules/admin/utils/entity-utils";
// components
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
// module components
import ActivityGrid from "@/modules/activity/components/ActivityGrid.vue";
import WeekSelector from "@/modules/activity/components/WeekSelector.vue";


export default {
	name: "ActivityView",

	components: {
		DefaultLayout,
		ActivityGrid,
		WeekSelector,
	},

	async created() {
		await this.loadTables([
			"list_option",
			"field_definition",
			"ticket",
			"week",
			"day",
			"activity"
		]);

		this.loadDone = true;
	},

	data() {
		return {
			loadDone: false,
			selectedWeekId: null,
		};
	},

	computed: {
		...mapState({
			formValues: $s => $s.form.formValues,
		}),

		...mapGetters("entity", [
			"getListOptions",
			"getEntityDescription"
		]),

		activitiesByWeek() {
			return activitySrv.getActivitiesByWeekId(this.selectedWeekId)
		},

		activityFormDesc() {
			return this.getEntityDescription("activity")
		},
	},

	methods: {
		...mapMutations("form", [
			"SET_FIELD",
			"RESET_FORM",
		]),

		...mapActions("entity", [
			"loadTables",
			"addItem",
			"updateItem",
			"deleteItem",
		]),

		// ============================================= WEEK NAVIGATION

		onWeekSelected(weekId) {
			this.selectedWeekId = weekId;
			activitySrv.getActivitiesByWeekId(this.selectedWeekId);
		},

		// ============================================= FORM HANDLING

		onFieldValueChanged(changeData) {
			this.SET_FIELD(changeData);
		},

		onReset() {
			this.$refs.bxForm.resetForm();
			setTimeout(() => this.RESET_FORM(), 300);
		},

		// ============================================= CRUD ACTIONS

		onAddActivity(dayId) {
			// set some default values
			const DEFAULT_VALUES = {
				day: String(dayId),
				duration: 30,
				type: "$D"
			}

			for (const k of Object.keys(DEFAULT_VALUES)) {
				this.SET_FIELD({ key: k, value: DEFAULT_VALUES[k] });
			}

			this.openModal();
			nextTick(() => {
				this.$refs.bxForm.initForm(DEFAULT_VALUES);
			})
		},

		onEditActivity(activityData) {
			activityData.duration = parseDurationInMin(activityData.duration);
			this.openModal();
			nextTick(() => this.$refs.bxForm.initForm(activityData))
		},

		async onSave() {
			// this.formValues is a computed
			const action = isInteger(this.formValues.id) // call action in store-entity
				? "updateItem"
				: "addItem"

			await this[action]({
				tableName: "activity",
				item: prepareItem(this.formValues)
			});

			this.onReset();
			this.$refs.modal_ref.close();
		},

		async onDeleteActivity() {
			await this.deleteItem({ tableName: "activity", id: this.formValues.id });
			this.onReset();
			this.$refs.modal_ref.close();
		},

		// ============================================= MODAL HANDLING

		openModal() {
			this.$refs.modal_ref.open();
		},

		onCancel() {
			this.$refs.modal_ref.close();
		},
	}
}
</script>


