<template>
	<div class="grid grid-cols-5 gap-1">

		<p
			v-for="p in phases"
			:key="p"
			class="text-2xl font-bold w-8 text-center"
			:class="{'text-stone-300 border rounded': p === currPhase, 'text-stone-600': p !== currPhase}"
		>
			{{ p }}
		</p>

	</div>
</template>


<script>

export default {
	name: "PhaseStepper",

	props: {
		currPhase: String
	},

	data() {
		return {
			phases: ["A", "B", "C", "D", "E"]
		}
	}

}
</script>