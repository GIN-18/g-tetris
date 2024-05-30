<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    class="flex flex-col justify-center items-center w-full p-1 border-4 border-black text-sm"
  >
    <p class="relative top-[-8px] px-1 whitespace-nowrap bg-nes-gray">
      {{ props.title }}
    </p>
    <slot></slot>
  </div>
</template>
