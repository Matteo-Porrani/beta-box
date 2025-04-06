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

				<div class="h-10"></div>

				<div class="bx-modal-footer">
					<slot name="footer">

						<button
							class="w-36 bg-lime-600 hover:bg-lime-500 rounded py-2 px-6 text-stone-800"
							@click="show = false"
						>
							Close
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

defineExpose({ open, close });

function open() {
	show.value = true;
}

function close() {
	show.value = false;
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
	transition: opacity 0.2s ease;
}

.modal-container {
	@apply bg-stone-900 border border-stone-500;
	width: 45vw;
	margin: auto;
	padding: 20px 30px;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.2s ease;
}

.bx-modal-header {
	margin-top: 0;
	text-align: center;
}

.bx-modal-body {
	margin: 20px 0;
	max-height: 65vh;
	overflow-y: auto;
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
	-webkit-transform: scale(1.025);
	transform: scale(1.025);
}
</style>