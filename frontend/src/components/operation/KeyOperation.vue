<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue";
import { emitter } from "@/assets/js/emitter.js";

const gameMode = inject("gameMode");
const keys = ref({
  play: "i",
  reset: "o",
  volume: "p",
  rotate: "k",
  drop: "w",
  right: "d",
  left: "a",
  down: "s",
});

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
});

function handleKeyDown(e) {
  switch (e.key) {
    case keys.value.play:
      if (gameMode.checkGameMode("2p")) return;
      emitter.emit("play");
      break;
    case keys.value.reset:
      if (gameMode.checkGameMode("2p")) return;
      emitter.emit("reset");
      break;
    case keys.value.volume:
      emitter.emit("volume");
      toggleVolume();
      break;
    case keys.value.drop:
      emitter.emit("drop");
      break;
    case keys.value.left:
      emitter.emit("left");
      break;
    case keys.value.right:
      emitter.emit("right");
      break;
    case keys.value.down:
      emitter.emit("down", true);
      break;
    case keys.value.rotate:
      emitter.emit("rotate");
      break;
  }
}

function handleKeyUp(e) {
  if (e.key === keys.value.down) emitter.emit("down", false);
}
</script>

<template>
  <h2 class="flex gap-2 !mb-6">
    <!-- <span class="icon-[pixelarticons--device-laptop] text-2xl"></span> -->
    <p class="mb-0">Key Bindings</p>
  </h2>
  <ul class="flex flex-col gap-3 w-full mb-0">
    <li
      class="flex justify-between items-center w-2/3 text-xs"
      v-for="key in Object.keys(keys)"
      :key="key"
    >
      <p class="mb-0">{{ key.toUpperCase() }}:</p>
      <p class="mb-0">{{ keys[key] }}</p>
    </li>
  </ul>
</template>
