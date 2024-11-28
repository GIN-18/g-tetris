<script setup>
const props = defineProps({
  name: String,
  label: String,
})
</script>

<template>
  <div class="pt-3 leading-8 text-sm md:text-base">
    <slot></slot>
  </div>
</template>
