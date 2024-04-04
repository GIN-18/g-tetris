<script setup>
const props = defineProps({
  title: String,
  isShow: Boolean,
});
</script>

<template>
  <Transition appear name="dialog-outter">
    <div
      class="z-10 fixed top-0 right-0 flex flex-col justify-center items-center gap-16 w-full h-full p-8 bg-black/50"
      v-if="props.isShow"
    >
      <div
        class="dialog-inner nes-container flex flex-col justify-between items-center gap-16 bg-nes-gray"
      >
        <h2 class="text-3xl">{{ props.title }}</h2>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-outter-enter-active,
.dialog-outter-leave-active {
  transition: opacity 0.4s ease;
}

.dialog-outter-enter-from,
.dialog-outter-leave-to {
  opacity: 0;
}

.dialog-outter-enter-active .dialog-inner,
.dialog-outter-leave-active .dialog-inner {
  transition: all 0.4s ease;
}

.dialog-outter-enter-from .dialog-inner,
.dialog-outter-leave-to .dialog-inner {
  transform: scale(0);
  opacity: 0;
}
</style>
