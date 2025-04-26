<template>
	<DefaultLayout view-title="Dev">
		<div class="dev-view-root">

			<!--	======================================================================		-->
			<!--	COLORS		-->

			<div class="flex gap-2">
				<div class="color-sample bg-lime-600"></div>
				<div class="color-sample bg-yellow-400"></div>
				<div class="color-sample bg-sky-500"></div>
				<div class="color-sample bg-pink-700"></div>
				<div class="color-sample bg-orange-500"></div>
				<div class="color-sample bg-purple-500"></div>
<!--				<div class="color-sample bg-blue-600"></div>-->
			</div>

			<div class="h-5"/>

			<div class="flex items-center gap-5">

				<BxButton
					label="Two"
					type="soft"
				/>

				<BxButton
					label="Add"
				>
					<template #leftSlot>
						<BxIcon icon="add"/>
					</template>
				</BxButton>

				<BxButton
					label="Second"
					type="secondary"
				/>

				<BxButton
					text
					label="Simple"
				/>

				<BxButton
					label="Danger"
					type="danger"
				>
					<template #default>
						<BxIcon icon="trash"/>
					</template>
				</BxButton>

				<BxButton
					label="Danger"
					type="danger"
				/>

				<BxButton
					label="One"
				/>

				<BxButton
					type="danger"
				>
					<template #default>
						<BxIcon icon="trash"/>
					</template>
				</BxButton>

				<BxButton
					label="A"
					size="small"
				/>

				<BxButton
					label="B"
					size="small"
					type="secondary"
				/>

				<BxButton
					size="small"
					type="secondary"
				>
					<template #default>
						<BxIcon icon="copy" size="small"/>
					</template>
				</BxButton>

			</div>



			<div class="h-5"/>


			<div class="flex gap-2">
				<button
					class="
					w-32 bg-stone-800 border border-stone-500 text-stone-500 hover:bg-stone-900
					disabled:hover:cursor-not-allowed rounded py-2 px-6
				"
				>
					Cancel
				</button>
				<button
					class="
					w-32 bg-sky-500 border border-sky-500 hover:bg-sky-400
					disabled:hover:cursor-not-allowed rounded py-2 px-6 text-stone-800
				"
				>
					Add
				</button>

				<button
					class="flex items-center gap-1 hover:text-sky-500"
				>
					<BxIcon icon="add"/>
					Add
				</button>

			</div>


			<div class="h-5"/>

			<button
				@click="$emit('add-activity')"
				class="
					py-1 px-2 flex items-center justify-center gap-1 text-xs font-medium
					text-stone-400 bg-stone-800 hover:bg-stone-700 border border-stone-700
					rounded transition-colors
				"
			>
				<BxIcon icon="add" size="small" class="text-stone-400" />
			</button>

			<div class="h-2"/>

			<button
				@click="$emit('add-activity')"
				class="
					py-1 px-2 flex items-center justify-center gap-1 text-xs font-medium
					text-stone-400 bg-stone-800 hover:bg-stone-700 border border-stone-700
					rounded transition-colors
				"
			>
				<BxIcon icon="add" class="text-stone-400" />
			</button>







			<!--	MODAL		-->
<!--			<BxModal-->
<!--				ref="dev_modal_ref"-->
<!--			>-->

<!--				<template #header>-->
<!--					<h3 class="text-xl">Some nice header</h3>-->
<!--				</template>-->

<!--				<template #body>-->
<!--					<p v-for="n in 20" :key="n">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, ab consectetur et eveniet minus quisquam sed-->
<!--						voluptate. Cum, debitis dolorem explicabo, hic in labore perspiciatis placeat quis reprehenderit sapiente-->
<!--						voluptate!</p>-->
<!--				</template>-->

<!--			</BxModal>-->

<!--			<button-->
<!--				class="w-36 bg-lime-600 hover:bg-lime-500 rounded py-2 px-6 text-stone-800"-->
<!--				@click="openModal"-->
<!--			>-->
<!--				Open modal-->
<!--			</button>-->


			<div class="h-10"></div>





			<div class="h-10"></div>


			<!--	======================================================================		-->
			<!--	ICONS SAMPLES		-->



			<section class="hidden">
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
			</section>


		</div>
	</DefaultLayout>
</template>

<script>

import DefaultLayout from "@/components/layout/DefaultLayout.vue";
import { mapState } from "vuex";
import BxIcon from "@/components/UI/BxIcon.vue";
import BxModal from "@/components/UI/BxModal.vue";
import ActivityCard from "@/modules/activity/components/ActivityCard.vue";
import BxButton from "@/modules/ui/components/BxButton.vue";


export default {
	name: 'DevView',

	components: {
		BxButton,
		// ActivityCard,
		// BxModal,
		BxIcon,
		DefaultLayout,
	},

	data() {
		return {
			mockActivity: {"type":"$D","day":"1","description":"hello","tickets":"1","duration":"02:00","id":14,"url":"http://localhost:8080/admin","ticketInfo":["RDTW-1234"]},
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

.color-sample {
	@apply w-16 h-4 rounded
}
</style>

