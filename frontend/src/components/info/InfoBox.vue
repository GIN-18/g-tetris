<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-2 w-full text-sm">
    <p class="whitespace-nowrap">
      {{ props.title }}
    </p>
    <slot></slot>
  </div>
</template>
