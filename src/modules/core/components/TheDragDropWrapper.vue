<template>
	<div class="drag-container">
		<article
			v-for="(item, index) in items"
			:key="item.id"
			:draggable="!hasHandle || isDraggable"
			@dragstart="handleDragStart($event, index)"
			@dragover="handleDragOver($event, index)"
			@drop="handleDrop($event, index)"
			@dragend="handleDragEnd"
			:class="{
					'grid-multi-cols': hasHandle,
					'draggable': !hasHandle,
					'dragging': draggedIndex === index,
					'drag-over': dragOverIndex === index
				}"
		>
			<!-- handle -->
			<aside
				v-if="hasHandle"
				class="drag-handle"
				@mousedown="enableDrag"
				@mouseup="disableDrag"
				@mouseleave="disableDrag"
			/>
			<slot
				:item="item"
				:isBeingDragged="draggedIndex === index"
				:isDragOver="dragOverIndex === index"
			/>
		</article>
	</div>
</template>



<script>
export default {
	name: "TheDragDropWrapper",

	props: {
		items: {
			type: Array,
			required: true,
		},
		hasHandle: {
			type: Boolean,
			default: false
		}
	},

	emits: ["reorder"],

	data() {
		return {
			draggedIndex: null,
			dragOverIndex: null,
			isDraggable: false,
		};
	},

	methods: {
		handleDragStart(event, index) {
			this.draggedIndex = index;
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/html', event.target);
		},

		handleDragOver(event, index) {
			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';
			this.dragOverIndex = index;
		},

		handleDrop(event, dropIndex) {
			event.preventDefault();
			
			if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
				const draggedItem = this.items[this.draggedIndex];
				const reorderedItems = [...this.items];
				
				reorderedItems.splice(this.draggedIndex, 1);
				reorderedItems.splice(dropIndex, 0, draggedItem);
				
				this.$emit("reorder", reorderedItems);
			}
			
			this.draggedIndex = null;
			this.dragOverIndex = null;
		},

		handleDragEnd() {
			this.draggedIndex = null;
			this.dragOverIndex = null;
			this.isDraggable = false;
		},

		enableDrag() {
			this.isDraggable = true;
		},

		disableDrag() {
			this.isDraggable = false;
		},
	},

};
</script>



<style scoped>
.drag-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

article {
	display: grid;
	border-radius: 4px;
	transition: opacity 0.2s ease, transform 0.2s ease;
	user-select: none;
}

/* used if handle */
article.grid-multi-cols {
	grid-template-columns: auto 1fr;
}

article.draggable {
	cursor: grab;
}

article.dragging {
	opacity: 0.5;
	cursor: grabbing;
}

article.drag-over {
	transform: scale(1.02);
}

/* style for handle */
.drag-handle {
	background: #3f3f46;
	cursor: grab;
	display: grid;
	place-items: center;
	width: 20px;
	max-height: 40px;
	border-radius: 4px 0 0 4px;
}

.drag-handle::before {
	content: "⋮⋮";
	color: #71717a;
	font-size: 22px;
	letter-spacing: -2px;
}




.debug {
	position: fixed;
	width: 700px;
	height: 700px;
	overflow-y: auto;
	top: 40px;
	right: 40px;
	z-index: 999;
	padding: 10px;
}
</style>

