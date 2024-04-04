<script setup>
import { computed } from "vue";

const props = defineProps({
  type: String,
  text: String,
  icon: {
    type: [String, Object],
  },
});

const classList = computed(() => ({
  "nes-btn !flex justify-center items-center": true,
  "w-28 h-28 text-4xl is-error": props.type === "rotate",
  "w-14 h-14 text-2xl is-error": props.type === "arrow",
  "is-primary": props.type === "primary",
  "is-success": props.type === "success",
  "is-warning": props.type === "warning",
  "is-error": props.type === "error",
}));
</script>

<template>
  <button :class="classList" type="button">
    <span :class="props.icon" v-if="props.icon"></span>
    <p class="mb-0" v-if="props.text">{{ props.text }}</p>
  </button>
</template>
