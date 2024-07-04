<script setup>
import { onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { emitter } from "@/assets/js/emitter.js";
import { Tetris } from "@/assets/js/mode/Tetris.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import PlayfieldCanvas from "@/components/canvas/PlayfieldCanvas.vue";
import LeftSideInfo from "@/components/info/LeftSideInfo.vue";
import RightSideInfo from "@/components/info/RightSideInfo.vue";
import GameOverInfo from "@/components/info/GameOverInfo.vue";
import ButtonOperation from "@/components/operation/ButtonOperation.vue";
import KeyOperation from "@/components/operation/KeyOperation.vue";

// TODO: new instance acording to game mode
const tetris = new Tetris();

const game = useGameStore();

game.currentBag = tetris.getBag();

onMounted(() => {
  emitter.on("play", playGame);
  emitter.on("hold", holdTetromino);
});

onUnmounted(() => {
  emitter.off("play", playGame);
  emitter.off("hold", holdTetromino);
});

function playGame() {
  addTetromino();
}

function addTetromino() {
  game.currentTetromino = tetris.addTetromino(game.currentBag);
}

function holdTetromino() {
  const { currentTetromino, holdTetromino } = tetris.updateHoldTetromino(
    game.currentBag,
    game.currentTetromino,
    game.holdTetromino,
  );

  game.currentTetromino = currentTetromino;
  game.holdTetromino = holdTetromino;
}
</script>

<template>
  <Header>
    <Menu />
  </Header>

  <main class="flex justify-between items-center w-full">
    <LeftSideInfo />
    <PlayfieldCanvas />
    <RightSideInfo />
  </main>

  <ButtonOperation />
  <KeyOperation />

  <GameOverInfo />
</template>
