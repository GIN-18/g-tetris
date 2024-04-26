<script setup>
const model = defineModel();
const props = defineProps({
  title: String,
});
</script>

<!-- TODO: custom key binding -->
<template>
  <li class="flex justify-between w-32 text-xs">
    <label class="mb-0">{{ props.title }}:</label>
    <p class="mb-0">{{ model }}</p>
  </li>
</template>
