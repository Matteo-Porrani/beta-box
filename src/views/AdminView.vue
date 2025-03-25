<template>
	<DefaultLayout view-title="Admin">
		<div class="admin-view-root">

			<AdminForm/>

		</div>
	</DefaultLayout>
</template>

<script>
import { mapState } from "vuex";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import AdminForm from "@/components/admin/AdminForm.vue";


export default {
	name: 'AdminView',

	components: {
		AdminForm,
		DefaultLayout,
	},

	computed: {

	}
};
</script>



