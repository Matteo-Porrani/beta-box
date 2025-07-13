import { computed } from 'vue';

export function useActivityType(activityItem, activityService) {
	const typeLabel = computed(() => {
		return activityItem.value?.type
			? activityService.getLabelFromActivityCode(activityItem.value.type)
			: "-";
	});

	const headerColorClass = computed(() => {
		const colorMap = {
			'$D': 'bg-yellow-400', // develop
			'$A': 'bg-purple-500', // analyze
			'$R': 'bg-sky-400', // meet
			'$E': 'bg-orange-500', // exchange
			'$O': 'bg-stone-400', // other
		};
		return colorMap[activityItem.value?.type] || 'bg-stone-400';
	});

	return {
		typeLabel,
		headerColorClass
	};
}