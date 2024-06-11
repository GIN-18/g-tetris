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
let currentTetriminoIndex = 6;

onMounted(() => {
  // set canvas size
  canvas.value.width = game.block * 10;
  canvas.value.height = game.block * 20;

  ctx.value.scale(1, -1);
  ctx.value.translate(0, -canvas.value.height);

  drawCurrentTetrimino();

  // emitter.on("drop", dropPiece);
  emitter.on("left", moveTetriminoLeft);
  emitter.on("right", moveTetriminoRight);
  emitter.on("down", moveTetriminoDown);
  // emitter.on("play", playGame);
  // emitter.on("reset", resetGame);
  // emitter.on("volume", toggleVolume);
  emitter.on("rotate", rotateRight);
});

onUnmounted(() => {
  // emitter.off("drop", dropPiece);
  emitter.off("left", moveTetriminoLeft);
  emitter.off("right", moveTetriminoRight);
  emitter.off("down", moveTetriminoDown);
  // emitter.off("play", playGame);
  // emitter.off("reset", resetGame);
  // emitter.off("volume", toggleVolume);
  emitter.off("rotate", rotateRight);
});

function getCurrentTetrimino() {
  return game.currentBags[currentTetriminoIndex];
}

function getNextTetrimino() {
  currentTetriminoIndex -= 1;

  if (currentTetriminoIndex < 0) {
    currentTetriminoIndex = 6;
  }
}

function moveTetriminoRight() {
  moveTetrimino(1, 0);
}

function moveTetriminoLeft() {
  moveTetrimino(-1, 0);
}

function moveTetriminoDown() {
  if (!moveTetrimino(0, -1)) {
    mergeMatrix();
    xOffset = 4;
    yOffset = 18;
    getNextTetrimino();
    clearCanvas();
    drawMatrix();
    drawCurrentTetrimino();
  }
}

function moveTetrimino(xStep, yStep) {
  const shape = getCurrentTetrimino();
  const tetrimino = shape.pieces[rotation];
  const w = matrix[0].length;

  let canMove = true;

  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + xOffset + xStep;
    const y = tetrimino[i][1] + yOffset + yStep;

    if (x < 0 || x >= w || y < 0 || matrix[y][x]) {
      canMove = false;
      return canMove;
    }
  }

  if (canMove) {
    xOffset += xStep;
    yOffset += yStep;

    clearCanvas();
    drawMatrix();
    drawCurrentTetrimino();
  }

  return canMove;
}

function rotateRight() {
  const rotationOffset = {
    O: [
      [0, 0],
      [0, -1],
      [-1, -1],
      [-1, 0],
    ],
  };
  const name = getCurrentTetrimino().name;

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

function mergeMatrix() {
  const shape = getCurrentTetrimino();
  const type = shape.type;
  const tetrimino = shape.pieces[rotation];

  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + xOffset;
    const y = tetrimino[i][1] + yOffset;

    matrix[y][x] = type;
  }
}

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawMatrix() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (!matrix[i][j]) continue;

      ctx.value.fillStyle = "blue";
      ctx.value.fillRect(
        j * game.block,
        i * game.block,
        game.block,
        game.block,
      );
    }
  }
}

function drawCurrentTetrimino() {
  const shape = getCurrentTetrimino();
  const color = shape.color;
  const tetrimino = shape.pieces[rotation];

  ctx.value.fillStyle = color;
  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + xOffset;
    const y = tetrimino[i][1] + yOffset;
    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
