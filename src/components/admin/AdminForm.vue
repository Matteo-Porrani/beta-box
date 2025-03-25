<template>

<!--<pre>{{ formDescription }}</pre>-->

	<BxForm
		:formDescription="formDescription"
	/>


</template>


<script>
import { ADMIN_FORM_DESC } from "@/const/const-admin";
import BxForm from "@/components/UI/BxForm/BxForm.vue";

export default {

	name: "AdminForm",
	components: { BxForm },

	data() {
		return {
			formDescription: ADMIN_FORM_DESC,
		}
	}

};
</script>