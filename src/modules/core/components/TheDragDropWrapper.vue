<template>
	<div class="drag-container">
		<article
			v-for="(item, index) in displayItems"
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
					'drag-over': dragOverIndex === index,
					'ghost-placeholder': isLivePreview && (dragOverIndex === index) && (draggedIndex !== index)
				}"
			:style="{
				transition: isLivePreview ? 'transform 0.2s ease' : 'none'
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
			previewItems: [],
			isLivePreview: false,
			draggedItemId: null,
			originalDragIndex: null,
			lastDragOverIndex: null,
		};
	},

	computed: {
		displayItems() {
			return this.isLivePreview ? this.previewItems : this.items;
		},

	},

	methods: {
		handleDragStart(event, index) {
			this.draggedIndex = index;
			this.originalDragIndex = index;
			this.draggedItemId = this.items[index].id;
			this.previewItems = [...this.items];
			this.isLivePreview = true;
			this.lastDragOverIndex = null;
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/html', event.target);
		},

		handleDragOver(event, index) {
			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';
			this.dragOverIndex = index;
			
			// Only update preview if drop target has changed
			if (this.isLivePreview && this.draggedItemId !== null && this.lastDragOverIndex !== index) {
				this.previewItems = this.calculatePreviewOrder(this.draggedItemId, index);
				this.lastDragOverIndex = index;
			}
		},

		handleDrop(event, dropIndex) {
			event.preventDefault();
			
			if (this.draggedItemId !== null && this.originalDragIndex !== dropIndex) {
				// Calculate the final order if we haven't already
				if (this.lastDragOverIndex !== dropIndex) {
					this.previewItems = this.calculatePreviewOrder(this.draggedItemId, dropIndex);
				}
				
				// Emit the final reordered items
				this.$emit("reorder", this.previewItems);
			}
			
			// Reset all preview state
			this.draggedIndex = null;
			this.dragOverIndex = null;
			this.isLivePreview = false;
			this.previewItems = [];
			this.draggedItemId = null;
			this.originalDragIndex = null;
			this.lastDragOverIndex = null;
		},

		handleDragEnd() {
			this.draggedIndex = null;
			this.dragOverIndex = null;
			this.isDraggable = false;
			this.isLivePreview = false;
			this.previewItems = [];
			this.draggedItemId = null;
			this.originalDragIndex = null;
			this.lastDragOverIndex = null;
		},

		enableDrag() {
			this.isDraggable = true;
		},

		disableDrag() {
			this.isDraggable = false;
		},

		calculatePreviewOrder(draggedItemId, overIndex) {
			if (draggedItemId === null || overIndex === null) {
				return this.previewItems;
			}

			// Use the original items array to get stable indices
			const newOrder = [...this.items];
			
			// Find the dragged item by ID
			const draggedItemIndex = newOrder.findIndex(item => item.id === draggedItemId);
			if (draggedItemIndex === -1) {
				return this.previewItems;
			}
			
			// If dropping on the same position, no change needed
			if (draggedItemIndex === overIndex) {
				return this.previewItems;
			}
			
			const draggedItem = newOrder[draggedItemIndex];
			
			// Remove the dragged item from its current position
			newOrder.splice(draggedItemIndex, 1);
			
			// Use overIndex directly for both UP and DOWN directions
			// This works because overIndex represents the exact array index where we want to insert

			// Insert at the calculated position
			newOrder.splice(overIndex, 0, draggedItem);
			
			return newOrder;
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
	will-change: transform;
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

/* Ghost placeholder styling for live preview */
article.ghost-placeholder {
	//background-color: #fef3c7;
	border: 2px dashed #fde047; /* yellow-300 */
	opacity: 0.7;
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

</style>

