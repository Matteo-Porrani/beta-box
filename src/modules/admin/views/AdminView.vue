<template>
	<DefaultLayout>
		<div
			v-if="contentLoaded"
			class="admin-view-root"
		>

			<div data-test="entity-selector">
				<select
					class="w-96 pr-2"
					v-model="tableName"
				>
					<option
						v-for="e in entitiesList"
						:key="e.value"
						:value="e.value"
					>
						{{ e.label }}
					</option>
				</select>
			</div>

			<div class="h-4"></div>

			<!-- LIST -->
			<div v-show="viewMode === '$L'">
<!--				<button-->
<!--					class="flex items-center gap-1 hover:text-lime-600"-->
<!--					@click="setMode('$F')"-->
<!--				>-->
<!--					<BxIcon icon="add"/>-->
<!--					Add-->
<!--				</button>-->


				<BxIconButton
					icon="add"
					label="Add"
				/>

				<div class="h-4"/>

				<EntityTable
					:table-name="tableName"
					:form-description="formDescription"
					@edit-item="onEditItem"
					@duplicate-item="onDuplicateItem"
					@delete-item="onDeleteItem"
				/>
			</div>

			<!-- FORM -->
			<template v-if="viewMode === '$F'">
				<EntityForm
					ref="entity_form_ref"
					:table-name="tableName"
					:form-description="formDescription"
					@item-saved="setMode('$L')"
					@cancel="setMode('$L')"
				/>

				<div class="h-4"/>
			</template>
		</div>
	</DefaultLayout>
</template>


<script>
// Vue related
import { nextTick } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
// utils
import { nrm } from "@/modules/core/utils/core-utils";
// const
import { ENTITY_TEMP_DESC } from "@/modules/admin/const/const-admin";
// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";

import EntityTable from "@/modules/admin/components/EntityTable.vue";
import EntityForm from "@/modules/admin/components/EntityForm.vue";
import BxIconButton from "@/modules/ui/components/BxIconButton.vue";


export default {
	name: 'AdminView',

	components: {
		BxIconButton,
		DefaultLayout,
		EntityTable,
		EntityForm,
	},

	data() {
		return {
			contentLoaded: false,
			viewMode: "$L",
			tableName: "",
			formDescription: [],

			links: [
				{ code: '$L', label: 'List' },
				{ code: '$F', label: 'Form' },
			]
		}
	},

	computed: {
		...mapState({
			entities: $s => $s.entity.entities,
		}),

		...mapGetters("entity", [
			"getListOptions",
			"getEntityDescription"
		]),

		entitiesList() {
			// if (Object.keys(this.entities).length === 0) return [];
			return this.getListOptions('$entities') ?? [];
		},

	},

	watch: {

		tableName(newVal) {
			const desc = this.getEntityDescription(newVal);

			if (desc?.length > 0) {
				this.formDescription = desc;
			} else {
				// FIXME -- temporary
				const hcDesc = ENTITY_TEMP_DESC[newVal] ?? [];

				if (newVal === "field_definition") {
					const typeEntry = hcDesc.find(e => e.field === "type");
					typeEntry.options = this.getListOptions(typeEntry.list);
				}

				this.formDescription = hcDesc;
			}
		}
	},

	async mounted() {
		// list_option table must be loaded first
		await this.loadItems("list_option");

		for (const e of this.entitiesList.filter(ent => ent.value !== "list_option")) {
			await this.loadItems(e.value);
		}

		this.tableName = "ticket";

		// debug
		// EntitySrv.logEntityFieldDefs()

		this.contentLoaded = true;
	},

	methods: {

		...mapActions("entity", [
			"loadItems",
			"deleteItem",
		]),

		// =============================================
		// EVENT HANDLERS
		// =============================================

		async onDeleteItem(id) {
			await this.deleteItem({ // call to store-entity action
				tableName: this.tableName,
				id: id
			});
		},

		onEditItem(itemId) {
			this._cloneItemAndEmitEdit(itemId);
		},

		onDuplicateItem(itemId) {
			this._cloneItemAndEmitEdit(itemId, true);
		},

		/**
		 * private method called for both 'edit' & 'duplicate' actions
		 * @param {number} itemId
		 * @param {boolean} isDuplication
		 * @private
		 */
		_cloneItemAndEmitEdit(itemId, isDuplication = false) {
			const srcObject = this.entities[this.tableName].find(r => r.id === itemId);
			const clone = nrm(srcObject);
			if (isDuplication) delete clone.id;

			this.setMode("$F");
			nextTick(() => this.$refs.entity_form_ref.onEditItem(clone));
		},

		// =============================================
		// COMPONENT DISPLAY
		// =============================================

		setMode(mode) {
			this.viewMode = mode;
		}

	}
};
</script>


<style scoped>
select {
	@apply bg-stone-700 rounded text-stone-200 p-1 text-xl
}
</style>
