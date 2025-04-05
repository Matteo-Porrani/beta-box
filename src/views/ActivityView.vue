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
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { activitySrv } from "@/services/ActivitySrv";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import ActivityGrid from "@/components/activity/ActivityGrid.vue";
import BxModal from "@/components/UI/BxModal.vue";
import BxForm from "@/components/UI/BxForm/BxForm.vue";
import { isInteger, parseDurationInMin } from "@/utils/core-utils";
import { prepareItem } from "@/utils/entity-utils";
import { nextTick } from "vue";

export default {
	name: "ActivityView",

	components: {
		BxForm,
		BxModal,
		DefaultLayout,
		ActivityGrid
	},

	async created() {

		for (const t of ["list_option", "field_definition", "ticket", "day", "activity"]) {
			await this.loadItems(t);
		}

		const activities = activitySrv.getActivities();
		console.log('Activities with formatted dates:', activities);
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
			"loadItems",
			"addItem",
			"updateItem",
		]),

		onFieldValueChanged(changeData) {
			this.SET_FIELD(changeData);
		},

		onAddAct(dayId) {
			console.log('Add activity for dayID:', dayId);
			this.SET_FIELD({ key: "day", value: String(dayId)})
			this.SET_FIELD({ key: "duration", value: 30})

			this.openModal();
			nextTick(() => {
				this.$refs.bxForm.initForm({ day: String(dayId), duration: 30 })
			})
		},

		onEditAct(activityData) {
			console.log("onEditAct", activityData)

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

