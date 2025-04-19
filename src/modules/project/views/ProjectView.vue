<template>

	<BxModal ref="modal_ref">
		<template #header>TTT</template>
		<template #body>
			<EntityForm
				ref="entity_form_ref"
				table-name="ticket"
				:form-description="entityDescription"
				@item-saved="closeModal"
				@cancel="closeModal"
			/>
		</template>
		<template #footer>
			<span></span>
		</template>
	</BxModal>

	<DefaultLayout>
		<h1 class="text-lg font-bold">Project</h1>

		<div class="h-4"/>

		<TheSortFilterBar
			:column-options="sortKeys"
			@sort-filter-change="onSortFilterChange"
		/>

		<div class="h-2"/>

		<div class="border border-stone-500 rounded p-1 flex justify-end gap-2">
			<p class="flex items-center gap-2 w-32 text-center">
				<input type="checkbox" v-model="activeConf.showActive">
				Active
			</p>
			<p class="flex items-center gap-2 w-32 text-center">
				<input type="checkbox" v-model="activeConf.showInactive">
				Inactive
			</p>
		</div>

		<div class="h-2"/>

		<!-- TABLE -->
		<TicketRow
			:ticket="{ isHeader: true }"
		/>
		<section class="ticket-table space-y-1 max-h-[72vh] overflow-y-auto mt-1">
			<TicketRow
				v-for="t in tickets"
				:key="t.id"
				:ticket="t"
				@edit-ticket="onEditTicket"
			/>
		</section>
	</DefaultLayout>
</template>


<script>
// Vue related
import { nextTick } from "vue";
// services
import ProjectSrv from "@/modules/project/services/ProjectSrv";
import TableSrv from "@/modules/core/services/TableSrv";
import EntitySrv from "@/modules/core/services/EntitySrv";
// utils
import { nrm } from "@/modules/core/utils/core-utils";
// components
import BxModal from "@/components/UI/BxModal.vue";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import TicketRow from "@/modules/project/components/TicketRow.vue";
import TheSortFilterBar from "@/modules/core/components/TheSortFilterBar.vue";
import EntityForm from "@/modules/admin/components/EntityForm.vue";


export default {

	name: "ProjectView",
	components: {
		EntityForm,
		BxModal,
		DefaultLayout,
		TheSortFilterBar,
		TicketRow,
	},

	data() {
		return {
			sortByCol: "one",
			sortAsc: true,

			filterByCol: null,
			filterNeedle: "",
			showFilterByCol: false,

			activeConf: {
				showActive: true,
				showInactive: false,
			},

			// NOT REACTIVE
			sortKeys: [
				"phase",
				"status",
				"topic",
				"title",
				"comment",
				"description",
				"sprint",
				"active"
			],

			entityDescription: EntitySrv.getEntityDescription("Ticket"),
		}
	},

	computed: {

		// sorted & filtered tickets
		tickets() {
			let t = ProjectSrv.getTickets(
				this.sortByCol,
				this.sortAsc,
				this.filterNeedle,
				this.filterByCol,
				this.activeConf
			) ?? []

			// retrieve list labels
			t = TableSrv.getListLabels(t, "Ticket");

			return t;
		}
	},

	methods: {
		// react to changes in sort or filter
		onSortFilterChange(e) {
			const { key, value } = e;
			this[key] = value;
		},

		onEditTicket(id) {
			// retrieve NON-HYDRATED objects
			const srcObject = ProjectSrv.getSrcTickets().find(t => t.id === id)
			const clone = nrm(srcObject);
			this.openModal();
			nextTick(() => this.$refs.entity_form_ref.onEditItem(clone));
		},

		openModal() {
			this.$refs.modal_ref.open();
		},

		closeModal() {
			this.$refs.modal_ref.close();
		}
	}

}
</script>


