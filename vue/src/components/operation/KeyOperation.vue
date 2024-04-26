<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { emitter } from "@/assets/js/emitter.js";
import KeyInfoBox from "./KeyInfoBox.vue";

const keyMap = {
  drop: "w",
  right: "d",
  left: "a",
  down: "s",
  rotate: "k",
  play: "i",
  reset: "o",
  volume: "p",
};

const keys = ref(keyMap);

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
      emitter.emit("play");
      break;
    case keys.value.reset:
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
    case "s":
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
    <KeyInfoBox title="PLAY" v-model="keys.play" />
    <KeyInfoBox title="RESET" v-model="keys.reset" />
    <KeyInfoBox title="VOLUME" v-model="keys.volume" />
    <KeyInfoBox title="ROTATE" v-model="keys.rotate" />
    <KeyInfoBox title="DROP" v-model="keys.drop" />
    <KeyInfoBox title="LEFT" v-model="keys.left" />
    <KeyInfoBox title="RIGHT" v-model="keys.right" />
    <KeyInfoBox title="DOWN" v-model="keys.down" />
  </ul>
</template>
