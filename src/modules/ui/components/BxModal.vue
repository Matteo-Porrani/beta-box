<template>
	<Transition name="bx-modal">
		<div
			v-if="show"
			class="modal-mask"
		>
			<div
				class="modal-container"
				:class="widthClass"
			>

				<div class="bx-modal-header">
					<slot name="header">default header</slot>
				</div>

				<div class="bx-modal-body">
					<slot name="body">default body</slot>
				</div>

				<div class="bx-modal-footer">
					<slot name="footer">
						<BxButton
							text
							label="Close"
							@click="show = false"
						/>
					</slot>
				</div>

			</div>
		</div>
	</Transition>
</template>


<script setup>
import { ref, computed, defineExpose, defineProps } from "vue";

const $p = defineProps({
	width: {
		type: String,
		default: "regular"
	}
})

const show = ref(false);
const widthClass = computed(() => {
	if ($p.width === 'large') return 'modal-w-70';
	if ($p.width === 'xlarge') return 'modal-w-85';
	return 'modal-w-50'; // regular
});

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

/* regular */
.modal-w-50 {
	width: 50vw;
}

/* large */
.modal-w-70 {
	width: 50vw;
}

/* xlarge */
.modal-w-85 {
	width: 85vw;
}

.modal-container {
	@apply bg-stone-900 border border-stone-500;
	display: grid;
	gap: 1rem;
	grid-template-rows: auto 1fr auto;

	min-height: 50vh;
	margin: auto;
	padding: 20px 30px;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.2s ease;
}

.bx-modal-header {
	text-align: center;
}

.bx-modal-body {
	max-height: 85vh;
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