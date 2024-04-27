<script setup>
import { ref } from "vue";
import { useGameStore } from "@/stores/game.js";
import { emitter } from "@/assets/js/emitter.js";

import MenuItem from "./MenuItem.vue";
import ToggleButton from "./ToggleButton.vue";
import KeyOperation from "@/components/operation/KeyOperation.vue";
import Footer from "@/components/Footer.vue";

const game = useGameStore();
const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;

  if (game.gamePlay) emitter.emit("play");
}
</script>

<template>
  <button
    class="icon-[pixelarticons--menu] text-4xl"
    @click.prevent="toggleMenu"
  ></button>

  <Transition
    appear
    name="menu-outter"
    enter-active-class="animate-[fade-in_0.4s_ease_both]"
    leave-active-class="animate-[fade-out_0.4s_ease_both]"
  >
    <div
      class="z-10 fixed top-0 right-0 w-full h-full bg-black/50"
      v-show="showMenu"
    >
      <Transition
        appear
        name="menu-outter"
        enter-active-class="animate-[slide-in-right_0.4s_ease_both]"
        leave-active-class="animate-[slide-out-right_0.4s_ease_both]"
      >
        <aside
          class="z-20 fixed top-0 right-0 flex flex-col w-2/3 h-full p-3 text-white bg-nes-dark"
          v-show="showMenu"
        >
          <header class="flex justify-between items-center mb-4">
            <h2
              class="flex justify-start items-center gap-2 mb-0 text-lg text-nes-deep-yellow"
            >
              <span class="text-4xl icon-[pixelarticons--gamepad]"></span>
              MENU
            </h2>
            <button
              class="icon-[pixelarticons--close] text-3xl"
              @click.prevent="toggleMenu"
            ></button>
          </header>

          <main class="grow">
            <ul class="flex flex-col gap-2 mb-6">
              <MenuItem text="Preview">
                <ToggleButton option="isPreview" />
              </MenuItem>
            </ul>

            <KeyOperation />
          </main>

          <Footer />
        </aside>
      </Transition>
    </div>
  </Transition>
</template>
