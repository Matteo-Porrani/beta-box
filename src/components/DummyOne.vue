<template>
	<div class="dummy">
		<p>One</p>
		<p class="count">{{ count }}</p>
	</div>
</template>


<script>

export default {
	name: "DummyOne",
	props: {
		count: {
			type: Number,
			required: true
		}
	}
}
</script>

