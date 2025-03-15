<template>
	<DefaultLayout>
		<div class="home-view-content">
			<h2>
				Home
			</h2>

			<div class="sp-1"></div>

			<p>
				<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque deleniti doloribus ea, eaque esse fugit porro, quo reiciendis reprehenderit totam vel. Atque beatae doloribus et officia perferendis ratione rem?</span><span>Accusantium, architecto assumenda deserunt doloribus eos in ipsa iure iusto maxime modi molestiae recusandae, reprehenderit sed. Assumenda error eveniet incidunt laborum magni nihil nisi, omnis praesentium similique velit veniam vitae?</span>
				<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque deleniti doloribus ea, eaque esse fugit porro, quo reiciendis reprehenderit totam vel. Atque beatae doloribus et officia perferendis ratione rem?</span><span>Accusantium, architecto assumenda deserunt doloribus eos in ipsa iure iusto maxime modi molestiae recusandae, reprehenderit sed. Assumenda error eveniet incidunt laborum magni nihil nisi, omnis praesentium similique velit veniam vitae?</span>
			</p>

			<div class="sp-2"></div>
			<DummyOne :count="123"/>

			<div class="sp-2"></div>
			<pre>{{ tasks }}</pre>
		</div>
	</DefaultLayout>
</template>

<script>

import DummyOne from "@/components/DummyOne.vue";
import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import { mapState } from "vuex";


export default {
	name: 'HomeView',
	components: {
		DefaultLayout,
		DummyOne
	},

	computed: {
		...mapState({
			tasks: state => state.task.tasks,
		})
	}
};
</script>


<style>
h2 {
	display: flex;
	align-items: center;
	gap: 8px;
}
</style>
