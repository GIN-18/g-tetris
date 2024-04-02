<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="nes-container with-title w-full !p-4">
    <p class="title !text-sm whitespace-nowrap !bg-nes-white">{{ title }}</p>
    <slot></slot>
  </div>
</template>
