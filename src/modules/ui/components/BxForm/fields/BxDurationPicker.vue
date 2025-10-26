<template>

  <pre>{{ durationValue }}</pre>
  <pre>formatted: {{ formatDuration(durationValue) }}</pre>
  <pre>pickerVisible: {{ pickerVisible }}</pre>
  <div class="h-10"></div>

  <div ref="pickerWrapper" class="w-fit relative">

    <!-- Toggle button -->
    <button
        class="bg-stone-700 rounded w-24 p-1"
        @click="togglePicker"
    >
      {{ formatDuration(durationValue) }}
    </button>

    <!-- Timeline picker -->
    <div
        v-if="pickerVisible"
        class="absolute top-0 left-full ml-2 timeline-container bg-stone-700 rounded z-10 p-1"
    >

      <!-- Current value label (blue) -->
      <div
          class="absolute -top-8 bg-sky-500 text-stone-800 px-3 py-1 rounded text-sm"
          :style="{ left: currentValuePosition, transform: 'translateX(-50%)' }"
      >
        {{ formatDuration(durationValue) }}
      </div>

      <!-- Hovered value label (yellow) -->
      <div
          v-if="hoveredSegment !== null"
          class="absolute -top-8 bg-yellow-400 text-stone-800 px-3 py-1 rounded text-sm"
          :style="{ left: hoveredValuePosition, transform: 'translateX(-50%)' }"
      >
        {{ formatDuration(hoveredSegment) }}
      </div>

      <!-- Segments row -->
      <div class="flex gap-0.5 py-1">
        <button
            v-for="segment in segments"
            :key="segment"
            class="h-4 w-8 flex-1 rounded cursor-pointer transition-colors hover:opacity-80"
            :class="segment <= durationValue ? 'bg-sky-500' : 'bg-gray-400'"
            @click="selectDuration(segment)"
            @mouseenter="hoveredSegment = segment"
            @mouseleave="hoveredSegment = null"
        >
        </button>
      </div>

    </div>

  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"

const durationValue = ref(90);
const pickerVisible = ref(false);
const hoveredSegment = ref(null);

const step = 15;
const maxDuration = 480; // 8 hours in minutes

const pickerWrapper = ref(null);

const segments = computed(() => {
  return Array.from({ length: maxDuration / step }, (_, i) => (i + 1) * step);
});

const hourMarkers = computed(() => {
  return Array.from({ length: (maxDuration / 60) + 1 }, (_, i) => i);
});

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function togglePicker() {
  pickerVisible.value = !pickerVisible.value;
}

function selectDuration(value) {
  durationValue.value = value;
  pickerVisible.value = false;
}

function handleClickOutside(event) {
  if (pickerWrapper.value && !pickerWrapper.value.contains(event.target)) {
    pickerVisible.value = false;
  }
}

const currentValuePosition = computed(() => {
  const segmentIndex = durationValue.value / step;
  const totalSegments = maxDuration / step;
  const percentage = (segmentIndex / totalSegments) * 100;
  return `${percentage}%`;
});

const hoveredValuePosition = computed(() => {
  if (hoveredSegment.value === null) return "0%";
  const segmentIndex = hoveredSegment.value / step;
  const totalSegments = maxDuration / step;
  const percentage = (segmentIndex / totalSegments) * 100;
  return `${percentage}%`;
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

</script>



