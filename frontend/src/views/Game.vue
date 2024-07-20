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
  requestAnimationFrame(gameLoop);

  emitter.on("play", playGame);
  emitter.on("left", moveTetrominoLeft);
  emitter.on("right", moveTetrominoRight);
  emitter.on("hardDrop", hardDropTetromino);
  emitter.on("softDrop", softDropTetromino);
  emitter.on("rotateRight", rotateRight);
  emitter.on("rotateLeft", rotateLeft);
  emitter.on("rotateReverse", rotateFlip);
  emitter.on("hold", holdTetromino);
});

onUnmounted(() => {
  emitter.off("play", playGame);
  emitter.off("left", moveTetrominoLeft);
  emitter.onf("right", moveTetrominoRight);
  emitter.off("hardDrop", hardDropTetromino);
  emitter.off("softDrop", softDropTetromino);
  emitter.off("rotateRight", rotateRight);
  emitter.off("rotateLeft", rotateLeft);
  emitter.off("rotateReverse", rotateFlip);
  emitter.off("hold", holdTetromino);
});

function playGame() {
  addTetromino();
}

function gameLoop(currentTime) {
  const dropInterval = tetris.getDropInterval(game.level) * 1000;
  const deltaTime = currentTime - tetris.lastRenderTime;

  if (deltaTime > dropInterval) {
    if (!game.activeTetromino) {
      addTetromino();
    }
    fallTetrominoToLand();

    tetris.lastRenderTime = currentTime;
  }

  requestAnimationFrame(gameLoop);
}

function moveTetrominoLeft() {
  tetris.moveTetromino(game.activeTetromino, -1, 0);
}

function moveTetrominoRight() {
  tetris.moveTetromino(game.activeTetromino, 1, 0);
}

function hardDropTetromino() {
  while (tetris.moveTetromino(game.activeTetromino, 0, 1)) {}
  landTetromino();
}

function softDropTetromino(enable) {
  if (enable && !tetris.moveTetromino(game.activeTetromino, 0, 1)) {
    landTetromino();
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

function holdTetromino() {
  const { activeTetromino, holdTetromino } = tetris.updateHoldTetromino(
    game.activeTetromino,
    game.holdTetromino,
  );

  game.activeTetromino = activeTetromino;
  game.holdTetromino = holdTetromino;
}

function fallTetrominoToLand() {
  if (!tetris.moveTetromino(game.activeTetromino, 0, 1)) {
    landTetromino();
  }
}

function landTetromino() {
  if (game.holdTetromino) {
    game.holdTetromino.holdLock = false;
  }

  tetris.mergeMatrix(game.activeTetromino);
  updateLines();
  updateScore();
  updateLevel();
  tetris.clearFilledLines();
  tetris.resetTetrominoOption(game.activeTetromino);
  addTetromino();
}

function updateLines() {
  game.lines += tetris.getLines();
}

function updateScore() {
  game.score += tetris.getScore(game.level);
}

function updateLevel() {
  game.level += tetris.getLevelIncrement(game.lines);
}

function addTetromino() {
  if (!game.activeTetromino || !tetris.checkGameover(game.activeTetromino)) {
    game.activeTetromino = tetris.getActiveTetromino();
    tetris.updateBag();
  } else {
    // TODO: handle game over
    console.log("game over");
  }
}
</script>

<template>
  <Header>
    <Menu />
  </Header>

  <main class="flex justify-between items-center w-full">
    <LeftSideInfo />
    <PlayfieldCanvas :block="game.block" />
    <RightSideInfo />
  </main>

  <ButtonOperation />
  <KeyOperation />

  <GameOverInfo />
</template>
