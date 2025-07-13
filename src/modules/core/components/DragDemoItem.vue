<template>
	<div class="bg-indigo-900 rounded p-2">

		<p class="text-2xl">{{ item.id }}</p>
		<p>{{ item.name }}</p>

	</div>
</template>


<script>

export default {
	name: "DragDemoItem",

	props: {
		item: {
			type: Object,
			required: true
		}
	},

}

</script>