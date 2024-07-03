<script setup>
const props = defineProps({
  text: String,
});
</script>

<template>
  <li class="flex justify-between items-center text-xs">
    <p>{{ text }}</p>
    <slot></slot>
  </li>
</template>
