<template>
	<article
		class="border bg-stone-700 rounded p-1"
	>
		<BxIcon
			:icon=" notif?.getIcon()"
			:class="textCC"
			size="large"
		/>
		<p class="text-xl">{{ notif?.message }}</p>
	</article>
</template>


<script setup>
import { computed, defineProps } from 'vue'
import BxIcon from "@/components/UI/BxIcon.vue";
import { AppNotification } from "@/types/AppNotification";
const $p = defineProps({
	notif: AppNotification
})

const textCC = computed(() => {
	return $p.notif?.getTextColorClass()
})
</script>
