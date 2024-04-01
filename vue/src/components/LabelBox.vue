<script setup>
const props = defineProps({
  label: String,
});
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="font-semibold">{{ props.label }}</span>
    <slot></slot>
  </div>
</template>
