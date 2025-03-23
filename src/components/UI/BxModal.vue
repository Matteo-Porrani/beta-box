<template>
	<Transition name="bx-modal">
		<div v-if="show" class="modal-mask">
			<div class="modal-container">

				<div class="bx-modal-header">
					<slot name="header">default header</slot>
				</div>

				<div class="bx-modal-body">
					<slot name="body">default body</slot>
				</div>

				<div class="bx-modal-footer">
					<slot name="footer">

						<button @click="show = false">
							CLOSE
						</button>

					</slot>
				</div>
			</div>
		</div>
	</Transition>
</template>


<script setup>
import { ref, defineExpose } from "vue";

const show = ref(false);

defineExpose({ open, });

function open() {
	show.value = true;
}
</script>


<style>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	transition: opacity 0.3s ease;
}

.modal-container {
	@apply bg-stone-600;
	width: 30vw;
	margin: auto;
	padding: 20px 30px;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
}

.bx-modal-header {
	margin-top: 0;
	text-align: center;
}

.bx-modal-body {
	margin: 20px 0;
}

.bx-modal-footer {
	display: flex;
	justify-content: center;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.bx-modal-enter-from {
	opacity: 0;
}

.bx-modal-leave-to {
	opacity: 0;
}

.bx-modal-enter-from .modal-container,
.bx-modal-leave-to .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
</style>