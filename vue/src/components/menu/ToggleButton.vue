<script setup>
import { useGameStore } from "@/stores/game.js";

const game = useGameStore()

const props = defineProps({
  option: {
    type: String,
    required: true,
  },
});

function changeStatus() {
  game[props.option] = !game[props.option];
}
</script>

<template>
  <button v-if="game[props.option]" @click="changeStatus">
    <span
      class="text-2xl icon-[pixelarticons--toggle-right] bg-nes-green"
    ></span>
  </button>
  <button v-else @click="changeStatus">
    <span class="text-2xl icon-[pixelarticons--toggle-left] bg-nes-deep-gray"></span>
  </button>
</template>
