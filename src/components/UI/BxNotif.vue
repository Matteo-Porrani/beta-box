<template>
	<article>
		<BxIcon
			:icon=" notif?.getIcon()"
			:class="notif?.getTextColorClass()"
			size="large"
		/>

		<p>{{ notif.id }}</p>
		<p>{{ notif?.message }}</p>
	</article>
</template>


<script setup>
import {defineProps} from 'vue'
import BxIcon from "@/components/UI/BxIcon.vue";
import { AppNotification } from "@/types/AppNotification";
defineProps({
	notif: AppNotification
})
</script>
