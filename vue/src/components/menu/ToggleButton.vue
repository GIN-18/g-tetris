<script setup>
import { useGameStore } from "@/stores/game.js";

const game = useGameStore();

const props = defineProps({
  option: {
    type: String,
    required: true,
  },
});

function changeStatus(enable) {
  localStorage.setItem(props.option, enable);
  game[props.option] = JSON.parse(localStorage.getItem(props.option));
}
</script>

<template>
  <button v-if="JSON.parse(game[props.option])" @click.prevent="changeStatus(false)">
    <span
      class="text-2xl icon-[pixelarticons--toggle-right] bg-nes-green"
    ></span>
  </button>
  <button v-else @click.prevent="changeStatus(true)">
    <span
      class="text-2xl icon-[pixelarticons--toggle-left] bg-nes-deep-gray"
    ></span>
  </button>
</template>
