<template>
	<router-link :to="dest">

		<div class="icon-wrapper">
			<slot name="icon">
				<IconCircle/>
			</slot>
		</div>
		<span>{{ label }}</span>

	</router-link>
</template>


<script>
// The component is directly coupled to 'Tabler Icons'
import { IconCircle } from "@tabler/icons-vue"
export default {

	name: "MenuItem",

	components: {
		IconCircle
	},

	props: {
		dest: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		}
	}

}

</script>


<style scoped>
a {
	//border: 1px solid #919399;
	display: grid;
	grid-template-columns: 32px 1fr;
	align-items: center;
	height: 2.5rem;
	border-radius: 4px;
	padding: 0 8px;
	transition: all .2s ease-in-out;
}

a:hover {
	background: #414349;
}

.icon-wrapper {
	display: grid;
}
</style>
