<template>
	<DefaultLayout view-title="Time Tools">
		<div class="grid gap-6">
			<div class="bg-stone-700 rounded-lg p-6">
				<h2 class="text-xl font-semibold mb-4">Welcome to Time Tools</h2>
				<p class="text-stone-300 mb-4">
					This is a basic scaffolding for the Time Tools module.
				</p>

				<div class="grid gap-4 mt-6">
					<div class="bg-stone-600 p-4 rounded">
						<h3 class="font-medium mb-2">Current Time</h3>
						<p class="text-stone-300">{{ currentTime }}</p>
					</div>

					<div class="bg-stone-600 p-4 rounded">
						<h3 class="font-medium mb-2">Current Date</h3>
						<p class="text-stone-300">{{ currentDate }}</p>
					</div>
				</div>
			</div>
		</div>
	</DefaultLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DefaultLayout from '@/modules/core/components/layout/DefaultLayout.vue';

const currentTime = ref('');
const currentDate = ref('');

const updateTime = () => {
	const now = new Date();
	currentTime.value = now.toLocaleTimeString('fr-FR');
	currentDate.value = now.toLocaleDateString('fr-FR', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

let intervalId = null;

onMounted(() => {
	updateTime();
	intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
	if (intervalId) {
		clearInterval(intervalId);
	}
});
</script>

