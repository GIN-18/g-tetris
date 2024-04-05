<script setup>
const props = defineProps({
  label: String,
});
</script>

<template>
  <div class="flex justify-between items-center w-full">
    <span>{{ props.label }}</span>
    <slot></slot>
  </div>
</template>
