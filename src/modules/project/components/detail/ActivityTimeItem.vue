<template>
	<div class="p-1 flex gap-2 items-center text-sm">

		<p class="w-24">{{ item.day }}</p>
		<p class="w-12 bg-stone-700 p-1 rounded text-center text-xs">{{ item.duration }}</p>

		<template v-if="item.durationBlocks">
			<section class="flex gap-1 bg-stone-700 rounded p-0.5">
				<div
					v-for="b in item.durationBlocks"
					:key="b"
				>
					<div class="w-16">
						<div
							class="bg-lime-500 h-2 rounded"
							:style="`width: ${b}%`"
						/>
					</div>
				</div>
			</section>
		</template>
	</div>
</template>


<script>

export default {
	name: "ActivityTimeItem",

	props: {
		item: Object
	},

	data() {
		return {

		}
	}

}
</script>