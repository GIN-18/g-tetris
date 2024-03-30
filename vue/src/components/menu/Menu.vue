<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import MenuItem from "./MenuItem.vue";
import ToggleButton from "./ToggleButton.vue";

const game = useGameStore();
const { showSparator } = storeToRefs(game);

const showMenu = ref(false);

const emit = defineEmits(["play"]);

const props = defineProps({
  playStatus: {
    type: Boolean,
    required: true,
  },
});

function toggleMenu() {
  showMenu.value = !showMenu.value;
  showSparator.value = !showSparator.value;

  if (props.playStatus) emit("play");
}
</script>

<template>
  <button class="text-center" @click.prevent="toggleMenu">
    <span class="text-4xl icon-[pixelarticons--menu]"></span>
  </button>

  <div
    class="z-10 fixed top-0 right-0 w-full h-full bg-black/50"
    v-show="showMenu"
  ></div>

  <aside
    class="z-20 fixed top-0 right-0 w-2/3 h-full p-3 bg-nes-dark text-white"
    v-show="showMenu"
  >
    <header class="flex justify-between items-center mb-4">
      <h2 class="flex gap-2 justify-start items-center m-0 text-xl">
        <span class="text-3xl icon-[pixelarticons--gamepad]"></span>
        Menu
      </h2>
      <button
        class="flex justify-center items-center"
        @click.prevent="toggleMenu"
      >
        <span class="text-3xl icon-[pixelarticons--close]"></span>
      </button>
    </header>

    <ul class="flex flex-col gap-2">
      <MenuItem text="Preview">
        <ToggleButton option="isPreview" />
      </MenuItem>
    </ul>
  </aside>
</template>
