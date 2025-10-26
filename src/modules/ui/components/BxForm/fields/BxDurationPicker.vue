<template>
  <div ref="pickerWrapper" class="w-fit flex items-center gap-1 relative">

    <!-- Toggle button -->
    <button
        class="bg-stone-700 hover:bg-stone-600 rounded w-20 p-1 border border-stone-500 transition-colors"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
        :disabled="disabled"
        :aria-expanded="pickerVisible"
        :aria-label="`Duration: ${formatDuration(durationValue)}`"
        @click="togglePicker"
    >
      {{ formatDuration(durationValue) }}
    </button>

    <BxIconButton
        icon="xmark"
        type="soft"
        size="small"
        no-min-width
        @click="durationValue = 0"
    />

    <!-- Timeline picker -->
    <div
        v-if="pickerVisible"
        class="absolute top-0 left-full ml-2 timeline-container bg-stone-800 border border-stone-500 rounded z-50 p-2 shadow-lg"
    >

      <!-- Current value label (blue) -->
      <div
          class="absolute -top-8 bg-sky-500 text-stone-800 rounded text-xs font-medium px-1 py-0.5"
          :style="{ left: currentValuePosition, transform: 'translateX(-50%)' }"
      >
        {{ formatDuration(durationValue) }}
      </div>

      <!-- Hovered value label (yellow) -->
      <div
          v-if="hoveredSegment !== null"
          class="absolute -top-8 bg-yellow-400 text-stone-800 rounded text-xs font-medium px-1 py-0.5"
          :style="{ left: hoveredValuePosition, transform: 'translateX(-50%)' }"
      >
        {{ formatDuration(hoveredSegment) }}
      </div>

      <!-- Segments row -->
      <div class="flex gap-0.5">
        <button
            v-for="segment in segments"
            :key="segment"
            class="h-3 w-4 flex-1 rounded cursor-pointer transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
            :class="[
              segment <= durationValue
                ? 'bg-sky-500 hover:bg-sky-400'
                : 'bg-gray-400 hover:bg-gray-300'
            ]"
            :aria-label="`Select ${formatDuration(segment)}`"
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
/**
 * BxDurationPicker
 *
 * A visual timeline picker for selecting durations in fixed increments.
 * Displays segments from the step value up to maxDuration, allowing users
 * to select by clicking on timeline segments.
 *
 * @component
 * @example
 * <BxDurationPicker
 *   v-model="taskDuration"
 *   :step="15"
 *   :max-duration="480"
 *   :disabled="false"
 *   @change="handleChange"
 * />
 */
import { ref, computed, onMounted, onUnmounted, defineModel, defineProps, defineEmits } from "vue"

// Props
const props = defineProps({
  step: {
    type: Number,
    default: 15,
    validator: (value) => value > 0 && value <= 60
  },
  maxDuration: {
    type: Number,
    default: 480,
    validator: (value) => value > 0 && value <= 1440
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Model
const durationValue = defineModel({
  type: Number,
  default: 90
})

// Emits
const emit = defineEmits(["change", "open", "close"])

const pickerVisible = ref(false);
const hoveredSegment = ref(null);

const pickerWrapper = ref(null);

/**
 * Generate array of duration segments based on step and maxDuration
 */
const segments = computed(() => {
  return Array.from({ length: props.maxDuration / props.step }, (_, i) => (i + 1) * props.step);
});

/**
 * Format duration in minutes to HH:MM format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
function formatDuration(minutes) {
  if (!minutes || minutes < 0) return "00:00";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Toggle picker visibility
 */
function togglePicker() {
  if (props.disabled) return;

  pickerVisible.value = !pickerVisible.value;

  if (pickerVisible.value) {
    emit("open");
  } else {
    emit("close");
  }
}

/**
 * Select a duration value
 * @param {number} value - Duration in minutes
 */
function selectDuration(value) {
  if (props.disabled) return;

  // Validate value is within range
  if (value < props.step || value > props.maxDuration) {
    console.warn(`Duration ${value} is out of range [${props.step}, ${props.maxDuration}]`);
    return;
  }

  const oldValue = durationValue.value;
  durationValue.value = value;

  // Emit change event if value actually changed
  if (oldValue !== value) {
    emit("change", value);
  }

  pickerVisible.value = false;
  emit("close");
}

/**
 * Handle click outside to close picker
 * @param {Event} event - Click event
 */
function handleClickOutside(event) {
  if (pickerWrapper.value && !pickerWrapper.value.contains(event.target)) {
    if (pickerVisible.value) {
      pickerVisible.value = false;
      emit("close");
    }
  }
}

/**
 * Calculate CSS position for current value label
 */
const currentValuePosition = computed(() => {
  const segmentIndex = durationValue.value / props.step;
  const totalSegments = props.maxDuration / props.step;
  const percentage = (segmentIndex / totalSegments) * 100;
  return `${percentage}%`;
});

/**
 * Calculate CSS position for hovered value label
 */
const hoveredValuePosition = computed(() => {
  if (hoveredSegment.value === null) return "0%";
  const segmentIndex = hoveredSegment.value / props.step;
  const totalSegments = props.maxDuration / props.step;
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



