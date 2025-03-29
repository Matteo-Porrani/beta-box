<template>
	<DefaultLayout view-title="Admin">
		<div class="admin-view-root">

			<EntityForm/>

		</div>
	</DefaultLayout>
</template>

<script>
import { mapState } from "vuex";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import EntityForm from "@/components/admin/EntityForm.vue";


export default {
	name: 'AdminView',

	components: {
		EntityForm,
		DefaultLayout,
	},

	computed: {

	}
};
</script>



