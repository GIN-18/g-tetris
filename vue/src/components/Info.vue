<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <div class="nes-container with-title w-full !p-4 font-[press-start-2p]">
    <p class="title !text-sm whitespace-nowrap">{{ title }}</p>
    <slot></slot>
  </div>
</template>
