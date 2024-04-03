<script setup>
import { computed } from "vue";

const props = defineProps({
  type: String,
  icon: String,
  text: String,
});

const classList = computed(() => ({
  "nes-btn !flex justify-center items-center": true,
  "is-primary": props.type === "primary",
  "is-success": props.type === "success",
  "is-warning": props.type === "warning",
  "is-error": props.type === "error",
}));
</script>

<template>
  <button :class="classList" type="button">
    <span :class="props.icon"></span>
    <p>{{ props.text }}</p>
  </button>
</template>
