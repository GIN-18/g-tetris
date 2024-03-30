<script setup>
const props = defineProps({
  show: Boolean,
});
</script>

<template>
  <div
    class="z-10 fixed top-0 right-0 flex flex-col justify-center items-center gap-16 w-full h-full p-8 bg-black/50"
    v-if="show"
  >
    <div
      class="nes-container flex flex-col justify-between items-center gap-16 bg-nes-gray"
    >
      <slot></slot>
    </div>
  </div>
</template>
