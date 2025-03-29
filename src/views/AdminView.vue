<template>
	<DefaultLayout view-title="Admin">
		<div
			v-if="contentLoaded"
			class="admin-view-root"
		>

			<nav class="space-x-4">
				<button
					v-for="l in links"
					:key="l.code"
					@click="setMode(l.code)"
				>
					{{ l.label }}
				</button>
			</nav>

			<div class="h-4"></div>

			<template v-if="viewMode === '$L'">
				<EntityTable
					:table-name="tableName"
					:form-description="formDescription"
					@edit-item="onEditItem"
					@duplicate-item="onDuplicateItem"
				/>
			</template>

			<template v-else-if="viewMode === '$F'">
				<EntityForm
					ref="entity_form_ref"
					:table-name="tableName"
					:form-description="formDescription"
				/>
			</template>

		</div>
	</DefaultLayout>
</template>

<script>
// Vue related
import { nextTick } from "vue";
import { mapActions } from "vuex";
// const
import { ENTITY_TEMP_DESC } from "@/const/const-admin";
// components
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import EntityTable from "@/components/admin/EntityTable.vue";
import EntityForm from "@/components/admin/EntityForm.vue";


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
			tableName: "dummy",

			links: [
				{ code: '$L', label: 'List' },
				{ code: '$F', label: 'Form' },
			]
		}
	},

	computed: {
		formDescription() {
			return ENTITY_TEMP_DESC[this.tableName] ?? [];
		},
	},

	async mounted() {
		const r1 = await this.loadItems("list_option");
		console.log(r1)
		const r2 = await this.loadItems(this.tableName);
		console.log(r2)

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

		onDuplicateItem(clone) {
			this.setMode("$F");

			nextTick(() => {
				this.$refs.entity_form_ref.onEditItem(clone)
			});
		},


		setMode(mode) {
			this.viewMode = mode;
		}


	}
};
</script>



