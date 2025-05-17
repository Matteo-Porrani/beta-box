<template>
	<article class="rounded bg-stone-900 p-1">

		<div class="grid grid-cols-8 gap-2">
			<p>{{ week.id }}</p>

			<BxBadge
				v-for="d in week.daysFormatted"
				:key="d.id"
				:label="d.dateFormatted"
				class="w-full"
			/>
		</div>



<!--		<pre>{{ week.daysFormatted }}</pre>-->

	</article>
</template>


<script setup>

import { defineProps } from 'vue'
import BxBadge from "@/modules/ui/components/BxBadge.vue";


defineProps({
	week: Object
})

</script>

