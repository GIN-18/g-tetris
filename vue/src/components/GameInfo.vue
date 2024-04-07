<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="nes-container with-title w-full !px-3 !py-4">
    <p class="title !text-sm whitespace-nowrap">{{ title }}</p>
    <slot></slot>
  </div>
</template>
