<script setup>
import { computed } from "vue";
import { useMessageStore } from "@/stores/message.js";

const message = useMessageStore();

const classList = computed(() => ({
  "z-20 fixed top-2 right-2 flex justify-center items-center gap-2 p-4": true,
  "bg-nes-red": message.messageType === "error",
  "bg-nes-yellow": message.messageType === "warning",
  "bg-nes-green": message.messageType === "success",
}));

const icons = computed(() => ({
  "text-3xl": true,
  "icon-[pixelarticons--mood-sad]": message.messageType === "error",
  "icon-[pixelarticons--mood-neutral]": message.messageType === "warning",
  "icon-[pixelarticons--mood-happy]": message.messageType === "success",
}));
</script>

<template>
  <div :class="classList" v-show="message.showMessage">
    <span :class="icons"></span>
    <span>{{ message.messageText }}</span>
  </div>
</template>
