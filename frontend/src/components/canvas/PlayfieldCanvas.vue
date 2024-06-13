<script setup>
import { ref, computed, watch, inject, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { tetriminoColor, getBags } from "@/assets/js/tetrimino.js";
import { emitter } from "@/assets/js/emitter.js";

// get canvas info
const canvas = ref(null);
const width = computed(() => canvas.value.width);
const height = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();
const gameMode = inject("gameMode");

let matrix = new Array(20).fill(0).map(() => new Array(10).fill(0));
let currentShape = null;
let rotationXOffset = 0;
let rotationYOffset = 0;

onMounted(() => {
  // set canvas size
  canvas.value.width = game.block * 10;
  canvas.value.height = game.block * 20;

  ctx.value.scale(1, -1);
  ctx.value.translate(0, -canvas.value.height);

  emitter.on("play", playGame);
  // emitter.on("reset", resetGame);
  // emitter.on("volume", toggleVolume);
  emitter.on("drop", fallTetriminoToLand);
  emitter.on("left", moveTetriminoLeft);
  emitter.on("right", moveTetriminoRight);
  // emitter.on("down", moveTetriminoDown);
  emitter.on("rotate", rotateRight);
});

onUnmounted(() => {
  emitter.off("play", playGame);
  // emitter.off("reset", resetGame);
  // emitter.off("volume", toggleVolume);
  emitter.off("drop", fallTetriminoToLand);
  emitter.off("left", moveTetriminoLeft);
  emitter.off("right", moveTetriminoRight);
  // emitter.off("down", moveTetriminoDown);
  emitter.off("rotate", rotateRight);
});

function playGame() {
  addShape();
}

function addShape() {
  currentShape = getCurrentShape();
  updateCurrentBags();
  drawPlayfield();
}

function updateCurrentBags() {
  game.currentBags.pop();
  game.currentBags.unshift(game.nextBags.shift());

  if (!game.nextBags.length) {
    game.nextBags = getBags();
  }
}

function getCurrentShape() {
  const tetriminoIndex = game.currentBags.length - 1;

  return {
    x: 4,
    y: 18,
    rotation: 0,
    tetrimino: game.currentBags[tetriminoIndex],
  };
}

function getCurrentTetrimino() {
  return currentShape.tetrimino.pieces[currentShape.rotation];
}

function fallTetriminoToLand() {
  if (!moveTetrimino(0, -1)) {
    mergeMatrix();
    clearFilledLines();
    addShape();
    drawPlayfield();
  }
}

function moveTetriminoRight() {
  moveTetrimino(1, 0);
}

function moveTetriminoLeft() {
  moveTetrimino(-1, 0);
}

function moveTetrimino(xStep, yStep) {
  const tetrimino = getCurrentTetrimino();
  const w = matrix[0].length;

  let canMove = true;

  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + currentShape.x + xStep;
    const y = tetrimino[i][1] + currentShape.y + yStep;

    if (x < 0 || x >= w || y < 0 || matrix[y][x]) {
      canMove = false;
      return canMove;
    }
  }

  if (canMove) {
    currentShape.x += xStep;
    currentShape.y += yStep;

    drawPlayfield();
  }

  return canMove;
}

// TODO: have to rewrite
function rotateRight() {
  const rotationOffset = {
    O: [
      [0, 0],
      [0, -1],
      [-1, -1],
      [-1, 0],
    ],
  };
  const name = currentShape.tetrimino.name;
  const tempRotation = currentShape.rotation;

  currentShape.rotation += 1;
  if (currentShape.rotation > 3) {
    currentShape.rotation = 0;
  }

  if (rotationOffset[name]) {
    const x =
      rotationOffset[name][tempRotation][0] -
      rotationOffset[name][currentShape.rotation][0];
    const y =
      rotationOffset[name][tempRotation][1] -
      rotationOffset[name][currentShape.rotation][1];

    rotationXOffset = x;
    rotationYOffset = y;
  }

  drawPlayfield();
}

function mergeMatrix() {
  const type = currentShape.tetrimino.type;
  const tetrimino = getCurrentTetrimino();

  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + currentShape.x;
    const y = tetrimino[i][1] + currentShape.y;

    matrix[y][x] = type;
  }
}

function getFilledLines() {
  const filledLines = [];

  for (let i = 0; i < matrix.length; i++) {
    const isFilled = matrix[i].every((item) => !!item);

    if (isFilled) {
      filledLines.push(i);
    }
  }

  return filledLines;
}

function clearFilledLines() {
  const filledLines = getFilledLines();

  if (!filledLines.length) return;

  for (let i = filledLines.length - 1; i >= 0; i--) {
    matrix.splice(filledLines[i], 1);
    matrix.push(new Array(10).fill(0));
  }
}

function drawPlayfield() {
  clearCanvas();
  drawMatrix();
  drawCurrentTetrimino();
}

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawMatrix() {
  const w = matrix[0].length;
  const h = matrix.length;

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (!matrix[i][j]) continue;

      ctx.value.fillStyle = tetriminoColor[matrix[i][j] - 1];
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
  const color = currentShape.tetrimino.color;
  const tetrimino = getCurrentTetrimino();

  ctx.value.fillStyle = color;
  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + currentShape.x + rotationXOffset;
    const y = tetrimino[i][1] + currentShape.y + rotationYOffset;
    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
