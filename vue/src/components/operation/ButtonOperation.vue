<script setup>
import { inject } from "vue";
import { useGameStore } from "@/stores/game.js";
import { emitter } from "@/assets/js/emitter.js";

import Button from "@/components/button/Button.vue";
import ArrowButton from "@/components/button/ArrowButton.vue";
import ToggleButton from "@/components/button/ToggleButton.vue";

const game = useGameStore();
const gameMode = inject("gameMode");
</script>

<template>
  <div class="flex w-full">
    <!-- arrow button -->
    <div class="flex flex-col justify-center items-center w-1/2">
      <!-- drop button -->
      <ArrowButton type="drop" @click.prevent="emitter.emit('drop')" />

      <!-- left and right button -->
      <div class="flex justify-between items-center w-full">
        <ArrowButton type="left" @click.prevent="emitter.emit('left')" />
        <ArrowButton type="right" @click.prevent="emitter.emit('right')" />
      </div>

      <!-- down button -->
      <ArrowButton
        type="down"
        @touchstart.prevent="emitter.emit('down', true)"
        @touchend.prevent="emitter.emit('down', false)"
      />
    </div>

    <div class="flex flex-col justify-between items-end w-1/2">
      <!-- feature button -->
      <div class="flex gap-4">
        <!-- play game button -->
        <ToggleButton
          :status="game.gamePlay"
          event="play"
          trueIcon="icon-[pixelarticons--pause]"
          falseIcon="icon-[pixelarticons--play]"
          v-if="gameMode.checkGameMode('1p')"
        />

        <!-- reset game button -->
        <Button
          type="primary"
          icon="icon-[pixelarticons--reload]"
          @click.prevent="emitter.emit('reset')"
          v-if="gameMode.checkGameMode('1p')"
        />

        <!-- toggle volume button -->
        <ToggleButton
          :status="game.volumeUp"
          event="volume"
          trueIcon="icon-[pixelarticons--volume-vibrate]"
          falseIcon="icon-[pixelarticons--volume-x]"
        />
      </div>

      <!-- rotate button -->
      <ArrowButton type="rotate" @click.prevent="emitter.emit('rotate')" />
    </div>
  </div>
</template>
