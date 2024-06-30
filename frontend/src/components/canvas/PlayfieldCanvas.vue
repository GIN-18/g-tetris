<script setup>
import { ref, computed, watch, inject, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { palette } from "@/assets/js/palette.js";
import { rotationOffset, getBags } from "@/assets/js/tetrimino.js";
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
let startTime = 0;

onMounted(() => {
  // set canvas size
  canvas.value.width = game.block * 10;
  canvas.value.height = game.block * 20;

  emitter.on("play", playGame);
  emitter.on("left", moveTetriminoLeft);
  emitter.on("right", moveTetriminoRight);
  emitter.on("hardDrop", fallTetriminoToLand);
  emitter.on("softDrop", moveTetriminoDown);
  emitter.on("rotateRight", rotateRight);
  emitter.on("rotateLeft", rotateLeft);
  emitter.on("rotateReverse", rotateReverse);
  emitter.on("hold", holdTetrimino);
});

onUnmounted(() => {
  emitter.off("play", playGame);
  emitter.off("left", moveTetriminoLeft);
  emitter.off("right", moveTetriminoRight);
  emitter.off("hardDrop", fallTetriminoToLand);
  emitter.off("softDrop", moveTetriminoDown);
  emitter.off("rotateRight", rotateRight);
  emitter.off("rotateLeft", rotateLeft);
  emitter.off("rotateReverse", rotateReverse);
  emitter.off("hold", holdTetrimino);
});

// TODO: way to start game
function playGame() {
  // addShape();
  gameLoop();
}

function moveTetriminoRight() {
  moveTetrimino(1, 0);
}

function moveTetriminoLeft() {
  moveTetrimino(-1, 0);
}

// TODO: have to move tetrimino down
function moveTetriminoDown(enable) {
  console.log("move tetrimino down");
}

function rotateRight() {
  rotateTetrimino(1);
}

function rotateLeft() {
  rotateTetrimino(-1);
}

function rotateReverse() {
  rotateTetrimino(2);
}

function holdTetrimino() {
  let tempShape = null;

  if (!game.holdShape) {
    resetCurrentShapeOpsition();
    game.holdShape = currentShape;
    game.holdShape.holdLock = true;
    addShape();
    return;
  }

  if (game.holdShape.holdLock) return;

  resetCurrentShapeOpsition();
  tempShape = game.holdShape;
  game.holdShape = currentShape;
  currentShape = tempShape;
  game.holdShape.holdLock = true;

  drawPlayfield();
}

function gameLoop() {
  requestAnimationFrame((timestamp) => {
    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;

    console.log(elapsed);

    gameLoop();
  });
}

function addShape() {
  currentShape = getCurrentShape();
  updateCurrentBags();
  drawPlayfield();
}

function updateCurrentBags() {
  game.currentBags.shift();
  game.currentBags.push(game.nextBags.shift());

  if (!game.nextBags.length) {
    game.nextBags = getBags();
  }
}

function getCurrentShape() {
  return {
    x: 4,
    y: 1,
    rotation: 0,
    holdLock: false,
    tetrimino: game.currentBags[0],
  };
}

function getCurrentTetrimino() {
  return currentShape.tetrimino.pieces[currentShape.rotation];
}

function resetCurrentShapeOpsition() {
  if (!currentShape) return;
  currentShape.x = 4;
  currentShape.y = 1;
  currentShape.rotation = 0;
}

function fallTetriminoToLand() {
  if (!moveTetrimino(0, 1)) {
    // reset locking hold tetrimino
    if (game.holdShape) {
      game.holdShape.holdLock = false;
    }
    mergeMatrix();
    clearFilledLines();
    addShape();
    drawPlayfield();
  }
}

function moveTetrimino(xStep, yStep) {
  const tetrimino = getCurrentTetrimino();
  const w = matrix[0].length;
  const h = matrix.length;

  let canMove = true;

  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + currentShape.x + xStep;
    const y = tetrimino[i][1] + currentShape.y + yStep;

    if (x < 0 || x >= w || y >= h || matrix[y][x]) {
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

function rotateTetrimino(rotationStep) {
  const rotationInfo = checkRotation(rotationStep, 0);

  if (rotationInfo.canRotate) {
    currentShape.x += rotationInfo.wallKickXOffset;
    currentShape.y += rotationInfo.wallKickYOffset;
    currentShape.rotation = rotationInfo.nextRotation;
    drawPlayfield();
  }
}

function checkRotation(rotationStep, wallKickIndex) {
  if (wallKickIndex > 4) {
    return {
      canRotate: false,
    };
  }

  let wallKickXOffset = 0;
  let wallKickYOffset = 0;
  let nextRotation = 0;
  let currentRotation = currentShape.rotation;

  nextRotation = (currentRotation + rotationStep) % 4;

  if (nextRotation < 0) {
    nextRotation = 3;
  }

  const nextRotationTetrimino = currentShape.tetrimino.pieces[nextRotation];
  const name = remapName(currentShape.tetrimino.name);

  wallKickXOffset =
    rotationOffset[name][currentRotation][wallKickIndex][0] -
    rotationOffset[name][nextRotation][wallKickIndex][0];
  wallKickYOffset =
    rotationOffset[name][currentRotation][wallKickIndex][1] -
    rotationOffset[name][nextRotation][wallKickIndex][1];

  for (let i = 0; i < nextRotationTetrimino.length; i++) {
    const x = nextRotationTetrimino[i][0] + currentShape.x + wallKickXOffset;
    const y = nextRotationTetrimino[i][1] + currentShape.y + wallKickYOffset;

    if (!matrix[y] || matrix[y][x] || matrix[y][x] === undefined) {
      return checkRotation(rotationStep, wallKickIndex + 1);
    }
  }

  return {
    wallKickXOffset,
    wallKickYOffset,
    nextRotation,
    canRotate: true,
  };
}

function remapName(name) {
  const arr = ["T", "Z", "S", "J", "L"];
  if (arr.includes(name)) {
    return "A";
  }
  return name;
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

  for (let i = 0; i < filledLines.length; i++) {
    matrix.splice(filledLines[i], 1);
    matrix.unshift(new Array(10).fill(0));
  }
}

function drawPlayfield() {
  clearCanvas();
  drawMatrix();
  drawGhostPiece();
  drawCurrentTetrimino();
}

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value);
}

function drawMatrix() {
  const w = matrix[0].length;
  const h = matrix.length;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!matrix[y][x]) continue;

      ctx.value.fillStyle = palette.tetriminoColor[matrix[y][x] - 1];
      ctx.value.fillRect(
        x * game.block,
        y * game.block,
        game.block,
        game.block,
      );
    }
  }
}

function drawGhostPiece() {
  const color = palette.previewColor;
  const ghostPieceYOffset = getGhostPieceYOffset(currentShape.y);
  const tetrimino = getCurrentTetrimino();

  ctx.value.fillStyle = color;
  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + currentShape.x;
    const y = tetrimino[i][1] + ghostPieceYOffset;

    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}

function getGhostPieceYOffset(offset) {
  const tetrimino = getCurrentTetrimino();
  const h = matrix.length - 2;

  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + currentShape.x;
    const y = tetrimino[i][1] + offset;

    if (
      offset >= currentShape.y &&
      (y > h || (matrix[y] && matrix[y + 1][x]))
    ) {
      return offset;
    }
  }
  return getGhostPieceYOffset(offset + 1);
}

function drawCurrentTetrimino() {
  const color = currentShape.tetrimino.color;
  const tetrimino = getCurrentTetrimino();

  ctx.value.fillStyle = color;
  for (let i = 0; i < tetrimino.length; i++) {
    const x = tetrimino[i][0] + currentShape.x;
    const y = tetrimino[i][1] + currentShape.y;
    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
