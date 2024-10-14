<script setup>
const props = defineProps({
  label: String,
})
</script>

<template>
  <div class="flex justify-between items-center w-full text-sm">
    <span>{{ props.label }}</span>
    <slot></slot>
  </div>
</template>
