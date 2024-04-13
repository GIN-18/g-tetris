<script setup>
import { ref, computed, onMounted } from "vue";
import { socket } from "@/assets/js/socket.js";

const socketStatus = ref(null);

const iconClassList = computed(() => ({
  "text-5xl": true,
  "icon-[pixelarticons--cloud-done] text-nes-deep-green": socketStatus.value,
  "icon-[pixelarticons--cloud] text-nes-deep-gray": !socketStatus.value,
}));

onMounted(() => {
  socket.on("connect", () => {
    socketStatus.value = true;
  });
});
</script>

<template>
  <span :class="iconClassList"></span>
</template>
