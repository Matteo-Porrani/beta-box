<template>
	<article
		class="grid grid-cols-8 border bg-stone-700 rounded p-1"
	>
		<BxIcon
			:icon=" notif?.getIcon()"
			:class="textCC"
		/>
		<p class="col-span-7 text-lg">{{ notif?.message }}</p>
	</article>
</template>


<script setup>
import { computed, defineProps } from 'vue'
import { AppNotification } from "@/types/AppNotification";

const $p = defineProps({
	notif: AppNotification
})

const textCC = computed(() => {
	return $p.notif?.getTextColorClass()
})
</script>
