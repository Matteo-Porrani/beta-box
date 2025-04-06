<template>
	<DefaultLayout view-title="Activity">
		<ActivityGrid
			:days="activities"
			@add-activity="onAddAct"
			@edit-activity="onEditAct"
		/>
	</DefaultLayout>

	<!--	MODAL		-->
	<BxModal
		ref="modal_ref"
	>
		<template #header>
			<h2 class="font-bold text-3xl">Activity</h2>
		</template>
		<template #body>
			<BxForm
				ref="bxForm"
				:description="activityFormDesc"
				@field-value-changed="onFieldValueChanged"
			/>
		</template>
		<template #footer>
			<!-- THE BUTTONS -->
			<div class="w-full flex justify-between w-1/2 border border-stone-500 rounded p-1">
				<button
					class="
					w-32 bg-stone-800 border border-stone-500 text-stone-500 hover:bg-stone-900
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
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ActivityGrid from "@/components/activity/ActivityGrid.vue";
import BxModal from "@/components/UI/BxModal.vue";
import BxForm from "@/components/UI/BxForm/BxForm.vue";

export default {
	name: "ActivityView",

	components: {
		DefaultLayout,
		ActivityGrid,
		BxModal,
		BxForm
	},

	async created() {
		await this.loadTables(["list_option", "field_definition", "ticket", "day", "activity"]);
	},

	data() {
		return {};
	},

	computed: {
		...mapState({
			formValues: $s => $s.form.formValues,
		}),

		...mapGetters("entity", [
			"getListOptions",
			"getEntityDescription"
		]),

		activities() {
			return activitySrv.getActivities();
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
		]),

		onFieldValueChanged(changeData) {
			this.SET_FIELD(changeData);
		},

		onAddAct(dayId) {
			this.SET_FIELD({ key: "day", value: String(dayId)})
			this.SET_FIELD({ key: "duration", value: 30})

			this.openModal();
			nextTick(() => {
				this.$refs.bxForm.initForm({ day: String(dayId), duration: 30 })
			})
		},

		onEditAct(activityData) {
			const strDuration = activityData.duration;
			activityData.duration = parseDurationInMin(strDuration);

			this.openModal();
			nextTick(() => {
				this.$refs.bxForm.initForm(activityData)
			})
		},

		openModal() {
			this.$refs.modal_ref.open();
		},

		onCancel() {
			this.$refs.modal_ref.close();
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
			this.$emit("itemSaved");
			this.$refs.modal_ref.close();
		},

		onReset() {
			this.$refs.bxForm.resetForm();
			setTimeout(() => {
				this.RESET_FORM();
			}, 300);
		},
	}
}
</script>

<style scoped></style>

