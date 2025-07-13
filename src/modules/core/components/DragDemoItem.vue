<template>
	<div class="bg-purple-700 p-2">

		<p>{{ item.id }}</p>
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