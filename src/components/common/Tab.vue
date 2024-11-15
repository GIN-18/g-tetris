<script setup>
const props = defineProps({
  name: String,
  label: String,
})
</script>

<template>
  <div class="pt-3 text-sm leading-6">
    <slot></slot>
  </div>
</template>
