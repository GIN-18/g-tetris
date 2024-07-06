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

const game = useGameStore();

game.matrix = Tetris.generateMatrix(10, 20);
game.currentBag = Tetris.getBag();

// TODO: new instance acording to game mode
const tetris = new Tetris(game.matrix, game.currentBag);

onMounted(() => {
  emitter.on("play", playGame);
  emitter.on("left", moveTetrominoLeft);
  emitter.on("right", moveTetrominoRight);
  emitter.on("hardDrop", fallTetrominoToLand);
  // emitter.on("softDrop", moveTetrominoDown);
  emitter.on("rotateRight", rotateRight);
  emitter.on("rotateLeft", rotateLeft);
  emitter.on("rotateReverse", rotateFlip);
  emitter.on("hold", holdTetromino);
});

onUnmounted(() => {
  emitter.off("play", playGame);
  emitter.off("left", moveTetrominoLeft);
  emitter.onf("right", moveTetrominoRight);
  emitter.off("hardDrop", fallTetrominoToLand);
  // emitter.off("softDrop", moveTetrominoDown);
  emitter.off("rotateRight", rotateRight);
  emitter.off("rotateLeft", rotateLeft);
  emitter.off("rotateReverse", rotateFlip);
  emitter.off("hold", holdTetromino);
});

function playGame() {
  addTetromino();
}

function moveTetrominoLeft() {
  tetris.moveTetromino(game.activeTetromino, -1, 0);
}

function moveTetrominoRight() {
  tetris.moveTetromino(game.activeTetromino, 1, 0);
}

function fallTetrominoToLand() {
  if (!tetris.moveTetromino(game.activeTetromino, 0, 1)) {
    // handle tetromino land
    tetris.mergeMatrix(game.activeTetromino);
    addTetromino();
  }
}

function rotateRight() {
  tetris.rotateTetromino(game.activeTetromino, 1);
}

function rotateLeft() {
  tetris.rotateTetromino(game.activeTetromino, -1);
}

function rotateFlip() {
  tetris.rotateTetromino(game.activeTetromino, 2);
}

function addTetromino() {
  game.activeTetromino = tetris.getActiveTetromino();
  tetris.updateBag();
}

function holdTetromino() {
  const { activeTetromino, holdTetromino } = tetris.holdTetromino(
    game.activeTetromino,
    game.holdTetromino,
  );

  game.activeTetromino = activeTetromino;
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
