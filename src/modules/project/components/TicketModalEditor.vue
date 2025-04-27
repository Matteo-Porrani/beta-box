<template>
	<BxModal ref="modal_ref">
		<template #header>
			<h2 class="text-2xl font-bold">Ticket</h2>
		</template>
		<template #body>
			<EntityForm
				ref="entity_form_ref"
				table-name="ticket"
				:form-description="desc"
				@item-saved="closeModal"
				@cancel="closeModal"
			/>
		</template>
		<template #footer>
			<span></span>
		</template>
	</BxModal>
</template>


<script>
import { nextTick } from "vue";
import EntitySrv from "@/modules/core/services/EntitySrv";
import ProjectSrv from "@/modules/project/services/ProjectSrv";
import EntityForm from "@/modules/admin/components/EntityForm.vue";

export default {
	name: "TicketModalEditor",
	components: {
		EntityForm,
	},

	emits: ["editorClosed"],
	expose: ["openEditor"],

	data() {
		return {
			desc: null,
		}
	},

	beforeMount() {
		this.desc = EntitySrv.getEntityDescription("ticket");
	},

	methods: {

		openEditor(id) {
			// retrieve NON-HYDRATED source object
			const clone = ProjectSrv.getSrcTicketCloneById(id);
			this.openModal();
			nextTick(() => this.$refs.entity_form_ref.onEditItem(clone));
		},

		openModal() {
			this.$refs.modal_ref.open();
		},

		closeModal() {
			this.$refs.modal_ref.close();
			this.$emit("editorClosed")
		}
	}

}
</script>
