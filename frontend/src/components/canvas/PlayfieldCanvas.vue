<script setup>
import { ref, computed, watch, inject, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { emitter } from "@/assets/js/emitter.js";

// get canvas info
const canvas = ref(null);
const width = computed(() => canvas.value.width);
const height = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();
const gameMode = inject("gameMode");

let matrix = new Array(20).fill(0).map(() => new Array(10).fill(0));
let xOffset = 4;
let yOffset = 18;
let rotationXOffset = 0;
let rotationYOffset = 0;
let rotation = 0;
let currentTetriminoIndex = 0;

onMounted(() => {
  // set canvas size
  canvas.value.width = game.block * 10;
  canvas.value.height = game.block * 20;

  ctx.value.scale(1, -1);
  ctx.value.translate(0, -canvas.value.height);

  drawCurrentTetrimino();

  // emitter.on("drop", dropPiece);
  // emitter.on("left", movePieceLeft);
  // emitter.on("right", movePieceRight);
  // emitter.on("down", (enable) => movePieceDown(enable));
  // emitter.on("play", playGame);
  // emitter.on("reset", resetGame);
  // emitter.on("volume", toggleVolume);
  emitter.on("rotate", rotateRight);
});

onUnmounted(() => {
  // emitter.off("drop", dropPiece);
  // emitter.off("left", movePieceLeft);
  // emitter.off("right", movePieceRight);
  // emitter.off("down", (enable) => movePieceDown(enable));
  // emitter.off("play", playGame);
  // emitter.off("reset", resetGame);
  // emitter.off("volume", toggleVolume);
  emitter.off("rotate", rotateRight);
});

function getCurrentTetrimino() {
  return game.currentBags[currentTetriminoIndex];
}

function getNextTetrimino() {
  currentTetriminoIndex += 1;
}

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawCurrentTetrimino() {
  const shape = getCurrentTetrimino();
  const color = shape.color;
  const tetrimino = shape.tetriminoes[rotation];

  ctx.value.fillStyle = color;
  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + rotationXOffset + xOffset;
    const y = tetrimino[i][1] + rotationYOffset + yOffset;
    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}

function rotateRight() {
  const rotationOffset = {
    O: [
      [0, 0],
      [0, -1],
      [-1, -1],
      [-1, 0],

      [0, 0],
      [0, -1],
      [1, -1],
      [1, 0],
    ],
    I: [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, 1],
    ],
  };
  const name = getCurrentTetrimino().name;
  const previousRotation = rotation;

  rotation += 1;
  if (rotation > 3) {
    rotation = 0;
  }

  if (rotationOffset[name]) {
    const x = rotationOffset[name][rotation][0];
    const y = rotationOffset[name][rotation][1];

    rotationXOffset = x;
    rotationYOffset = y;
  }

  clearCanvas();
  drawCurrentTetrimino();
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
