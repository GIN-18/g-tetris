<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <li class="flex justify-between items-center">
    <p class="!mb-0">{{ text }}</p>
    <slot></slot>
  </li>
</template>
