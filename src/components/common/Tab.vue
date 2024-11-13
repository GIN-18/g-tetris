<script setup>
const props = defineProps({
  name: String,
  label: String,
})
</script>

<template>
  <div class="text-sm leading-6">
    <slot></slot>
  </div>
</template>
