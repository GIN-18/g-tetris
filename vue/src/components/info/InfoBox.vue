<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="nes-container with-title w-full !px-3">
    <p class="title !text-sm whitespace-nowrap !bg-nes-gray">
      {{ props.title }}
    </p>
    <slot></slot>
  </div>
</template>
