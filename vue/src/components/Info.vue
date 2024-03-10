<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full p-2 border-2 border-text rounded">
    <span class="font-semibold">{{ title }}</span>
    <slot></slot>
  </div>
</template>
