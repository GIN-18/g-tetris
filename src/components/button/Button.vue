<script setup>
import { computed } from "vue";

const props = defineProps({
  color: String,
  text: String,
  icon: {
    type: [String, Object],
  },
});

const classList = computed(() => ({
  "nes-btn !flex justify-center items-center": true,
  "is-primary": props.color === "blue",
  "is-success": props.color === "green",
  "is-warning": props.color === "yellow",
  "is-error": props.color === "red",
}));
</script>

<template>
  <button :class="classList" type="button">
    <span :class="props.icon" v-if="props.icon"></span>
    <p class="!mb-0" v-if="props.text">{{ props.text }}</p>
  </button>
</template>
