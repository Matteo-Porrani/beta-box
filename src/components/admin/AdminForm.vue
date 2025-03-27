<template>

<!--<pre>{{ formDescription }}</pre>-->

	<BxForm
		ref="bxForm"
		:formDescription="formDescription"
	/>

	<div class="h-4"></div>


	<div class="flex justify-between w-1/2 border rounded p-1">
		<button
			class="
			w-32 bg-teal-500 hover:bg-teal-400 disabled:bg-zinc-700
			disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800"
			@click="onSave"
		>
			Save
		</button>

		<button
			class="
			w-32 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-700
			disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800"
			@click="onReset"
		>
			Reset
		</button>
	</div>



	<div class="h-12"></div>

	<!-- TEMPORARY TABLE -->
	<div v-for="c in categories" :key="c.id" class="w-64 grid grid-cols-3 items-center gap-4 border p-1">
		<button
			class="border rounded p-1 hover:bg-stone-700"
			@click="openItem(c.id)"
		>{{ c.id }}</button>
		<p>{{ c.name }}</p>
		<p>{{ c.isFavorite }}</p>
	</div>

</template>


<script>
import { mapState } from "vuex";
import {
	// ADMIN_FORM_DESC,
	CATEGORY_FORM_DESC
} from "@/const/const-admin";
import BxForm from "@/components/UI/BxForm/BxForm.vue";

export default {

	name: "AdminForm",

	components: { BxForm },

	data() {
		return {
			formDescription: CATEGORY_FORM_DESC,

			categories: [
				{ id: 11, name: "sports", info: "some more info",  isFavorite: false, start: "2025-03-21@09:12", city: "M" },
				{ id: 25, name: "nature", info: "about the",  isFavorite: true, start: "2025-05-31@12:30", city: "R" },
				{ id: 36, name: "music", info: "some more info",  isFavorite: true, start: "2025-03-21@02:11", city: "P" },
			],

		}
	},

	computed: {
		...mapState({
			formValues: $s => $s.form.formValues,
		})
	},

	methods: {
		onSave() {
			console.log("SAVE")
			console.log(this.formValues)
		},

		openItem(id) {
			const item = this.categories.find(el => el.id === id);
			this.$refs.bxForm.initForm(item);
		},

		onReset() {
			this.$refs.bxForm.initForm({}); // empty object will reset
		},
	}

};
</script>