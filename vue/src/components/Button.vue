<script setup>
const props = defineProps({
  description: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  icon: {
    type: String,
  },
});

const { description } = props;

const classList = {
  "nes-btn !flex justify-center items-center": true,
  "w-28 h-28 text-4xl is-error": description === "rotate",
  "w-14 h-14 text-2xl is-error": description === "direction",
  "is-primary": description === "box",
  "is-success": description === "again",
  "is-warning": description === "quit"
};
</script>

<template>
  <button ref="button" :class="classList" type="button">
    <span :class="props.icon"></span>
    <span>{{ props.text }}</span>
  </button>
</template>
