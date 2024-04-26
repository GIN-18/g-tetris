<script setup>
const props = defineProps({
  text: String,
});
</script>

<template>
  <li class="flex justify-between">
    <p class="!mb-0">{{ text }}</p>
    <slot></slot>
  </li>
</template>
