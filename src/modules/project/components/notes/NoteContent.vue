<template>
	<div class="relative bg-stone-300 rounded-md overflow-auto p-2">
		<div class="absolute end-2 top-2">
			<button
				ref="copyBtn"
				class="
          rounded-md
          hover:bg-stone-200
          size-10
          grid place-content-center
          relative
        "
				@click="onCopy"
			>
				<BxIcon icon="copy" class="text-stone-500"/>
			</button>
		</div>

		<div v-if="parsedSnippet">
			<span v-html="parsedSnippet"></span>
		</div>

	</div>
</template>


<script setup>
import { ref, defineProps, onMounted, watch } from 'vue'
import { codeToHtml } from "shiki";

import BxIcon from "@/components/UI/BxIcon.vue";

const $p = defineProps({
	content: String,
	lang: String,
	fontSize: String,
})

const copyBtn = ref();

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText($p.content);
    copyBtn.value.classList.toggle("confirm-copy")
    setTimeout(() => copyBtn.value.classList.toggle("confirm-copy"), 500)
  } catch(err) {
    console.error(err);
  }
};

// const selLang = computed(() => selectedLang.value);
const parsedSnippet = ref("");

const parseContent = async () => {
  parsedSnippet.value = await codeToHtml($p.content, {
    lang: $p.lang,
    // theme: "min-light",
    // theme: "vitesse-light",
    // theme: "github-light",
    theme: "one-light",
  });
}

onMounted(async () => await parseContent());

watch(
	[() => $p.content, () => $p.lang],
  async () => await parseContent(),
  { deep: true }
)
</script>


<style scoped>
.confirm-copy:after {
  position: absolute;
  content: 'copied';
  top: 50%;
  left: -90%;
  transform: translate(-50%, -50%);
  color: #57534e; /* stone-600 */
  padding: 4px;
  border-radius: 8px;
}
</style>

<style>
.p-drawer-content {
  display: grid;
}

pre {
  background: #d6d3d1 !important;
  font-size: v-bind(fontSize);
	line-height: 1.6;
}
</style>
