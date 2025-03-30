<template>
	<DefaultLayout view-title="Admin">
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
			<template v-if="viewMode === '$L'">
				<EntityTable
					:table-name="tableName"
					:form-description="formDescription"
					@edit-item="onEditItem"
				/>

				<div class="h-4"/>

				<button
					class="flex items-center gap-1 hover:text-lime-600"
					@click="setMode('$F')"
				>
					<BxIcon icon="add"/>
					Add
				</button>
			</template>
			<!-- FORM -->
			<template v-else-if="viewMode === '$F'">
				<EntityForm
					ref="entity_form_ref"
					:table-name="tableName"
					:form-description="formDescription"
					@item-saved="setMode('$L')"
				/>

				<div class="h-4"/>


				<button
					class="flex items-center gap-1 hover:text-lime-600"
					@click="setMode('$L')"
				>
					<BxIcon icon="bars"/>
					List
				</button>
			</template>
		</div>
	</DefaultLayout>
</template>


<script>
// Vue related
import { nextTick } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
// const
import { ENTITY_TEMP_DESC } from "@/const/const-admin";
// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import EntityTable from "@/components/admin/EntityTable.vue";
import EntityForm from "@/components/admin/EntityForm.vue";
import BxIcon from "@/components/UI/BxIcon.vue";


export default {
	name: 'AdminView',

	components: {
		BxIcon,
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
		...mapGetters("entity", ["getList", "getEntityDescription"]),

		entitiesList() {
			// if (Object.keys(this.entities).length === 0) return [];
			return this.getList('$entities') ?? [];
		},

		// formDescription() {
		// 	return ENTITY_TEMP_DESC[this.tableName] ?? [];
		// },
	},

	watch: {

		tableName(newVal) {
			console.log("WATCH", newVal)
			const desc = this.getEntityDescription(newVal);

			if (desc.length > 0) {
				const desc = this.getEntityDescription(newVal);
				console.log("desc", desc)
				this.formDescription = desc;
			} else {
				this.formDescription = ENTITY_TEMP_DESC[newVal] ?? [];
			}

		}

	},

	async mounted() {
		// list_option table must be loaded first
		await this.loadItems("list_option");

		for (const e of this.entitiesList.filter(ent => ent.value !== "list_option")) {
			await this.loadItems(e.value);
		}

		this.tableName = "task";
		this.contentLoaded = true;
	},

	methods: {

		...mapActions("entity", [
			"loadItems",
		]),

		onEditItem(item) {
			this.setMode("$F");

			nextTick(() => {
				this.$refs.entity_form_ref.onEditItem(item)
			});
		},

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
