<script setup>
const props = defineProps({
  title: String,
  isShow: Boolean,
})
</script>

<template>
  <Transition
    appear
    name="dialog-outter"
    enter-active-class="animate-[fade-in_0.4s_ease_both]"
    leave-active-class="animate-[fade-out_0.4s_ease_both]"
  >
    <div
      class="z-10 fixed top-0 right-0 flex flex-col justify-center items-center gap-16 w-full h-full p-8 bg-black/50"
      v-show="props.isShow"
    >
      <Transition
        appear
        name="dialog-inner"
        enter-active-class="animate-[scale-in-center_0.4s_ease_both]"
        leave-active-class="animate-[scale-out-center_0.4s_ease_both]"
      >
        <div
          class="nes-container flex flex-col justify-between items-center gap-16 bg-nes-gray"
          v-show="props.isShow"
        >
          <h2 class="text-3xl">{{ props.title }}</h2>
          <slot></slot>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
