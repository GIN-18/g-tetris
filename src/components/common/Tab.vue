<script setup>
const props = defineProps({
  name: String,
  label: String,
})
</script>

<template>
  <div class="pt-3 text-sm leading-6 md:text-md">
    <slot></slot>
  </div>
</template>
