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
				<BxIconButton
					icon="add"
					label="Add"
					@click="setMode('$F')"
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
import { mapGetters, mapActions } from "vuex";
// utils
import { nrm } from "@/modules/core/utils/core-utils";
// const
import { DEFAULT_DISPLAYED_ENTITY, ENTITY_TEMP_DESC } from "@/modules/admin/const/const-admin";
// components
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";
import EntityTable from "@/modules/admin/components/EntityTable.vue";
import EntityForm from "@/modules/admin/components/EntityForm.vue";
import EntitySrv from "@/modules/core/services/EntitySrv";


export default {
	name: 'AdminView',

	components: {
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
		...mapGetters("entity", [
			"getListItemsByListCode",
		]),

		entitiesList() {
			return this.getListItemsByListCode('$entities') ?? [];
		},
	},

	watch: {
		tableName(newVal) {
			const desc = EntitySrv.getEntityDescription(newVal);

			if (desc?.length > 0) {
				this.formDescription = desc;
			} else {
				// FIXME -- temporary
				const hcDesc = ENTITY_TEMP_DESC[newVal] ?? [];

				if (newVal === "field_definition") {
					const typeEntry = hcDesc.find(e => e.field === "type");
					typeEntry.options = this.getListItemsByListCode(typeEntry.list);
				}

				this.formDescription = hcDesc;
			}
		}
	},

	async mounted() {
		await this.initScreen();
	},

	methods: {

		...mapActions("entity", [
			"loadTables",
			"deleteItem",
		]),

		// ============================================= INIT
		async initScreen() {
			// list_option table must be loaded first
			await this.loadTables(["list_option"]);

			// otherTables holds names of all tables other than 'list_option'
			const otherTables = EntitySrv.getListOfEntities().filter(ent => ent !== "list_option")

			await this.loadTables(otherTables)

			// this will display 'ticket' as default table in the grid
			this.tableName = DEFAULT_DISPLAYED_ENTITY;

			this.contentLoaded = true;
		},

		// ============================================= EVENT HANDLERS

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
			// retrieve the source item
			const srcObject = EntitySrv.getItemById(this.tableName, itemId);

			// make defensive copy
			const clone = nrm(srcObject);
			if (isDuplication) delete clone.id;

			this.setMode("$F");
			nextTick(() => this.$refs.entity_form_ref.onEditItem(clone));
		},

		// ============================================= COMPONENT DISPLAY

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
