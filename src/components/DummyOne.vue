<template>
	<div class="dummy">
		<p>One</p>
		<p class="count">{{ count }}</p>
	</div>
</template>


<script>
import {httpSrv} from "@/service/HttpSrv";

// interface User {
// 	id: number;
// 	firstName: string;
// 	lastName: string;
// 	email: string;
// }

export default {
	name: "DummyOne",
	props: {
		count: {
			type: Number,
			required: true
		}
	},

	async mounted() {
		await this.testHttp();
	},

	methods: {
		async testHttp() {
			try {
				const user = await httpSrv.get('/users/1');
				console.log(user);
			} catch (error) {
				console.error(`${error.message} (Status: ${error.status})`);
				if (error.data) {
					console.error('Additional error details:', error.data);
				}
			}
		}
	}
}
</script>

