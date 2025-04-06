<template>
	<DefaultLayout view-title="Dev">
		<div class="dev-view-root">


			<!--	MODAL		-->
			<BxModal
				ref="dev_modal_ref"
			>

				<template #header>
					<h3 class="text-xl">Some nice header</h3>
				</template>

				<template #body>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, ab consectetur et eveniet minus quisquam sed
						voluptate. Cum, debitis dolorem explicabo, hic in labore perspiciatis placeat quis reprehenderit sapiente
						voluptate!</p>
				</template>

			</BxModal>

			<button
				class="w-36 bg-lime-600 hover:bg-teal-400 rounded py-2 px-6 text-stone-800"
				@click="openModal"
			>
				Open modal
			</button>

			<div class="h-10"></div>

			<div class="w-96">
				<ActivityCard :activity="mockActivity"/>
			</div>




			<div class="h-10"></div>


			<!--	======================================================================		-->
			<!--	COLORS		-->

			<div class="flex gap-2">
				<div class="size-10 bg-yellow-400 rounded"></div>
				<div class="size-10 bg-lime-600 rounded"></div>
				<div class="size-10 bg-rose-700 rounded"></div>
			</div>


			<div class="h-10"></div>


			<!--	======================================================================		-->
			<!--	ICONS SAMPLES		-->


			<!-- (1) -->
			<div class="flex items-center gap-4 mb-10">
				<BxIcon
					icon="home"
					size="large"
				/>
				<p>Icon of size <code>"large"</code></p>
			</div>

			<!-- (2) -->
			<div class="flex items-center gap-4 mb-10">
				<p class="flex items-center text-blue-500">
					<BxIcon icon="data"/>
					Database
				</p>
				<p>Icon of default size (takes color of his <code>&lt;p&gt;</code>  parent)</p>
			</div>

			<!-- (3) -->
			<div class="flex items-center gap-4 mb-10">
				<BxIcon
					class="text-teal-500"
					icon="bolt"
					size="xlarge"
				/>
				<p>Icon of size <code>"xlarge"</code>, color is given with <code>.text-teal-500</code> class</p>
			</div>

			<!-- (4) -->
			<div class="flex items-center gap-4 mb-10">
				<BxIcon
					icon="stack"
				/>
				<p>Icon of default size</p>
			</div>

			<!-- (5) -->
			<div class="flex items-center gap-4 mb-10">
				<BxIcon
					icon="tag"
				/>
				<p>Icon of default size</p>
			</div>

			<div class="flex gap-2">
				<BxIcon icon="arrow_left"/><span>Nav</span>
				<BxIcon icon="arrow_right"/>
				<BxIcon icon="arrow_up"/>
				<BxIcon icon="arrow_down"/>

			</div>
		</div>
	</DefaultLayout>
</template>

<script>

import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import { mapState } from "vuex";
import BxIcon from "@/components/UI/BxIcon.vue";
import BxModal from "@/components/UI/BxModal.vue";
import ActivityCard from "@/components/activity/ActivityCard.vue";


export default {
	name: 'DevView',

	components: {
		ActivityCard,
		BxModal,
		BxIcon,
		DefaultLayout,
	},

	data() {
		return {
			mockActivity: {"type":"$D","day":"1","description":"hello","tickets":"1","duration":"02:00","id":14,"url":"http://localhost:8080/admin","ticketTitles":["RDTW-1234"]},
		}
	},

	computed: {
		...mapState({
			tasks: state => state.task.tasks,
		})
	},

	methods: {
		openModal() {
			this.$refs.dev_modal_ref.open();
		}
	}

};
</script>


<style scoped>
code {
	@apply text-rose-400 text-sm bg-stone-700 rounded p-1;
}
</style>

