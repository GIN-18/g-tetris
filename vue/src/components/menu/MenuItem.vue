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
    <span> {{ text }} </span>
    <slot></slot>
  </li>
</template>
