<template>

  <pre>{{ durationValue }}</pre>
  <pre>pickerVisible: {{ pickerVisible }}</pre>
<!--  <pre>items: {{ items }}</pre>-->
  <div class="h-10"></div>

  <div
      class="picker-wrapper w-fit relative"
  >

    <button
        class="bg-stone-700 rounded p-1"
        @click="showPicker"
    >
      {{ durationValue }}
    </button>

    <div
        v-if="pickerVisible"
        class="absolute flex gap-0.5 top-0 -right-2 translate-x-full picker bg-stone-700 rounded p-1"
    >
      <button
          v-for="item in items"
          :key="item"
          class="w-8 bg-stone-600 text-xs"
      >
        {{ item }}
      </button>
    </div>

  </div>
</template>


<script setup>
import { ref, computed } from "vue"

const durationValue = ref(30);

const pickerVisible = ref(false);

const step = ref(15);

const items = computed(() => {
  return Array.from({ length: 480 / step.value }, (_, i) => i * step.value);
});

function showPicker() {
  pickerVisible.value = true;
}

function hidePicker() {
  pickerVisible.value = false;
}

</script>



