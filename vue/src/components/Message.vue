<script setup>
import { computed } from "vue";
import { useMessageStore } from "@/stores/message.js";

const message = useMessageStore();

const classList = computed(() => ({
  "z-20 fixed top-2 right-2 flex justify-center items-center gap-2 p-3 border-4 border-black text-sm": true,
  "bg-nes-red": message.messageType === "error",
  "bg-nes-yellow": message.messageType === "warning",
  "bg-nes-green": message.messageType === "success",
}));

const icons = computed(() => ({
  "text-2xl": true,
  "icon-[pixelarticons--mood-sad]": message.messageType === "error",
  "icon-[pixelarticons--mood-neutral]": message.messageType === "warning",
  "icon-[pixelarticons--mood-happy]": message.messageType === "success",
}));

function hideMessage() {
  setTimeout(() => {
    message.showMessage = false;
  }, 2000);
}
</script>

<template>
  <Transition
    name="message"
    appear
    enter-active-class="animate-[scale-in-right_0.5s_ease_both]"
    leave-active-class="animate-[scale-out-right_0.5s_ease_both]"
  >
    <div
      :class="classList"
      v-show="message.showMessage"
      @animationend="hideMessage"
    >
      <span :class="icons"></span>
      <span>{{ message.messageText }}</span>
    </div>
  </Transition>
</template>
