<template>
	<div class="drag-container">

		<article
			v-for="(item, index) in items"
			:key="item.id"
			:draggable="isDraggable"
			@dragstart="handleDragStart($event, index)"
			@dragover="handleDragOver($event, index)"
			@drop="handleDrop($event, index)"
			@dragend="handleDragEnd"
			:class="{
					'dragging': draggedIndex === index,
					'drag-over': dragOverIndex === index
				}"
		>
			<div 
				class="drag-handle"
				@mousedown="enableDrag"
				@mouseup="disableDrag"
				@mouseleave="disableDrag"
			></div>
			<slot :item="item" :index="index" />
		</article>
	</div>
</template>



<script>
export default {
	name: "TheDragDropWithHandle",

	props: {
		items: {
			type: Array,
			required: true,
		},
	},

	emits: ['reorder'],

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
				
				this.$emit('reorder', reorderedItems);
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
	//border: 2px solid gold;
	//width: fit-content;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

article {
	//border: 2px solid crimson;
	//background: gray;
	border-radius: 4px;
	display: grid;
	grid-template-columns: auto 1fr;
	//cursor: grab;
	transition: opacity 0.2s ease, transform 0.2s ease;
	user-select: none;
}

/*
article:hover {
	border: 2px solid transparent;
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
 */

article.dragging {
	opacity: 0.5;
	cursor: grabbing;
	border-color: goldenrod;
}

article.drag-over {
	/*background: goldenrod;*/
	transform: scale(1.02);
}

.drag-handle {
	width: 20px;
	height: 70%;
	max-height: 50px;
	cursor: grab;
	background: #52525b;
	border-radius: 4px 0 0 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

/*
.drag-handle:hover {
	background: coral;
}
 */

.drag-handle::before {
	content: "⋮⋮";
	color: #a1a1aa;
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

