<template>
	<DefaultLayout view-title="Activity">
		<div
			v-if="loadDone"
			class="max-h-[85vh] overflow-y-auto"
		>
<!--			<BxOptionSelector-->
<!--				@week-selected="onWeekSelected"-->
<!--			/>-->

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

	<!--	MODAL		-->
	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<h2 class="font-bold text-3xl">Activity</h2>
		</template>
		<template #body>
			<button
				class="
					flex items-center gap-2
					w-32 bg-rose-600 border border-rose-600 hover:bg-rose-500
					disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800
					ms-auto mb-4
				"
				@click="onDeleteActivity"
			>
				<BxIcon icon="trash"/>
				Delete
			</button>


			<BxForm
				ref="bxForm"
				:description="activityFormDesc"
				@field-value-changed="onFieldValueChanged"
			/>
		</template>
		<template #footer>
			<!-- THE BUTTONS -->
			<div class="w-full flex justify-between">
				<button
					class="
					w-32 border border-stone-500 text-stone-500 hover:bg-stone-800
					disabled:hover:cursor-not-allowed rounded py-2 px-6
				"
					@click="onCancel"
				>
					Cancel
				</button>
				<button
					class="
					w-32 bg-lime-600 border border-lime-600 hover:bg-lime-500
					disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800
				"
					@click="onSave"
				>
					Save
				</button>
			</div>
		</template>

	</BxModal>
</template>

<script>
// Vue related
import { nextTick } from "vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
// service
import { activitySrv } from "@/service/ActivitySrv";
// utils
import { isInteger, parseDurationInMin } from "@/utils/core-utils";
import { prepareItem } from "@/utils/entity-utils";
// components
import BxModal from "@/components/UI/BxModal.vue";
import BxForm from "@/components/UI/BxForm/BxForm.vue";
import BxIcon from "@/components/UI/BxIcon.vue";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
// module component
import ActivityGrid from "@/modules/activity/components/ActivityGrid.vue";
import WeekSelector from "@/modules/activity/components/WeekSelector.vue";

export default {
	name: "ActivityView",

	components: {
		DefaultLayout,
		BxIcon,
		BxModal,
		BxForm,
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

		// =============================================
		// WEEK NAVIGATION
		// =============================================

		onWeekSelected(weekId) {
			console.log("weekId", weekId)
			this.selectedWeekId = weekId;
			activitySrv.getActivitiesByWeekId(this.selectedWeekId);
		},


		// =============================================
		// FORM HANDLING
		// =============================================

		onFieldValueChanged(changeData) {
			this.SET_FIELD(changeData);
		},

		onReset() {
			this.$refs.bxForm.resetForm();
			setTimeout(() => this.RESET_FORM(), 300);
		},

		// =============================================
		// CRUD ACTIONS
		// =============================================

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
			const strDuration = activityData.duration;
			activityData.duration = parseDurationInMin(strDuration);

			this.openModal();
			nextTick(() => {
				this.$refs.bxForm.initForm(activityData)
			})
		},

		async onSave() {
			const action = isInteger(this.formValues.id)
				? "updateItem"
				: "addItem"

			await this[action]({
				tableName: "activity",
				item: prepareItem(this.formValues)
			})

			this.onReset();
			this.$refs.modal_ref.close();
		},

		onDeleteActivity() {
			this.deleteItem({ tableName: "activity", id: this.formValues.id });
			this.onReset();
			this.$refs.modal_ref.close();
		},

		// =============================================
		// MODAL HANDLING
		// =============================================

		openModal() {
			this.$refs.modal_ref.open();
		},

		onCancel() {
			this.$refs.modal_ref.close();
		},
	}
}
</script>


