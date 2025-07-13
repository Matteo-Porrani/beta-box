<template>
	<div class="drag-container">

		<article
			v-for="(item, index) in items"
			:key="item.id"
			draggable="true"
			@dragstart="handleDragStart($event, index)"
			@dragover="handleDragOver($event, index)"
			@drop="handleDrop($event, index)"
			@dragend="handleDragEnd"
			:class="{
					'dragging': draggedIndex === index,
					'drag-over': dragOverIndex === index
				}"
		>
			<slot :item="item" :index="index" />
		</article>
	</div>
</template>



<script>
export default {
	name: "TheDragDrop",

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
				const newItems = [...this.items];
				
				newItems.splice(this.draggedIndex, 1);
				newItems.splice(dropIndex, 0, draggedItem);
				
				this.$emit('reorder', newItems);
			}
			
			this.draggedIndex = null;
			this.dragOverIndex = null;
		},

		handleDragEnd() {
			this.draggedIndex = null;
			this.dragOverIndex = null;
		},
	},

};
</script>



<style scoped>
.drag-container {
	//border: 2px solid gold;
	width: fit-content;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

article {
	//border: 2px solid crimson;
	border-radius: 4px;
	width: 400px;
	display: grid;
	cursor: grab;
	transition: opacity 0.2s ease, transform 0.2s ease;
	user-select: none;
}

article:hover {
	border: 2px solid transparent;
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

article.dragging {
	opacity: 0.5;
	cursor: grabbing;
	border-color: goldenrod;
}

article.drag-over {
	background: goldenrod;
	transform: scale(1.02);
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

