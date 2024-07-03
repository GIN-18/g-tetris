<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { palette } from "@/assets/js/palette.js";
import { rotationOffset, getBags } from "@/assets/js/tetromino.js";
import { emitter } from "@/assets/js/emitter.js";

// get canvas info
const canvas = ref(null);
const width = computed(() => canvas.value.width);
const height = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();

let matrix = new Array(20).fill(0).map(() => new Array(10).fill(0));
let currentShape = null;

// TODO: set timing for the game
let startTime = 0;
let interval = 5;

let frameID;

watch(
  [() => game.currentTetromino, () => game.isDrawGhostPiece],
  () => {
    drawPlayfield();
  },
  { deep: true },
);

onMounted(() => {
  // set canvas size
  canvas.value.width = game.block * 10;
  canvas.value.height = game.block * 20;

  // emitter.on("play", playGame);
  emitter.on("left", moveTetrominoLeft);
  emitter.on("right", moveTetrominoRight);
  emitter.on("hardDrop", fallTetrominoToLand);
  emitter.on("softDrop", moveTetrominoDown);
  emitter.on("rotateRight", rotateRight);
  emitter.on("rotateLeft", rotateLeft);
  emitter.on("rotateReverse", rotateReverse);
  emitter.on("hold", holdTetromino);
});

onUnmounted(() => {
  // emitter.off("play", playGame);
  emitter.off("left", moveTetrominoLeft);
  emitter.off("right", moveTetrominoRight);
  emitter.off("hardDrop", fallTetrominoToLand);
  emitter.off("softDrop", moveTetrominoDown);
  emitter.off("rotateRight", rotateRight);
  emitter.off("rotateLeft", rotateLeft);
  emitter.off("rotateReverse", rotateReverse);
  emitter.off("hold", holdTetromino);
});

function moveTetrominoRight() {
  moveTetromino(1, 0);
}

function moveTetrominoLeft() {
  moveTetromino(-1, 0);
}

// TODO: have to move tetrimino down
function moveTetrominoDown(enable) {
  console.log("move tetrimino down");
}

function rotateRight() {
  rotateTetromino(1);
}

function rotateLeft() {
  rotateTetromino(-1);
}

function rotateReverse() {
  rotateTetromino(2);
}

function holdTetromino() {
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

// TODO: set game loop
function gameLoop(timestamp) {
  if (timestamp - startTime >= interval) {
    if (!currentShape) {
      addShape();
    }

    fallTetrominoToLand();
    startTime = timestamp;
  }

  frameID = requestAnimationFrame(gameLoop);
}

function addShape() {
  currentShape = getCurrentShape();
  updateCurrentBags();

  if (checkGameOver()) {
    // game.gameOver = true;
    // handle game over
    // console.log("game over");
    console.log(frameID);
    cancelAnimationFrame(frameID);
  } else {
    drawPlayfield();
  }
}

function checkGameOver() {
  const tetromino = getCurrentTetromino();

  for (let i = 0; i < tetromino.length; i++) {
    const x = tetromino[i][0] + currentShape.x;
    const y = tetromino[i][1] + currentShape.y;

    if (matrix[y][x]) {
      return true;
    }
  }

  return false;
}

function updateCurrentBags() {
  game.currentBag.shift();
  game.currentBag.push(game.nextBag.shift());

  if (!game.nextBag.length) {
    game.nextBag = getBags();
  }
}

// TODO: set current y for tetromino
function getCurrentShape() {
  return {
    x: 4,
    y: 1,
    rotation: 0,
    holdLock: false,
    tetromino: game.currentBag[0],
  };
}

function getCurrentTetromino() {
  return currentShape.tetromino.pieces[currentShape.rotation];
}

function resetCurrentShapeOpsition() {
  if (!currentShape) return;
  currentShape.x = 4;
  currentShape.y = 1;
  currentShape.rotation = 0;
}

function fallTetrominoToLand() {
  if (game.gameOver) return;

  if (!moveTetromino(0, 1)) {
    // reset locking hold tetromino
    if (game.holdShape) {
      game.holdShape.holdLock = false;
    }

    mergeMatrix();
    updateLines();
    updateScore();
    updateLevel();
    clearFilledLines();
    addShape();
    drawPlayfield();
  }
}

function moveTetromino(xStep, yStep) {
  const tetromino = getCurrentTetromino();
  const w = matrix[0].length;
  const h = matrix.length;

  let canMove = true;

  for (let i = 0; i < tetromino.length; i++) {
    const x = tetromino[i][0] + currentShape.x + xStep;
    const y = tetromino[i][1] + currentShape.y + yStep;

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

function rotateTetromino(rotationStep) {
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

  const nextRotationTetromino = currentShape.tetromino.pieces[nextRotation];
  const name = remapName(currentShape.tetromino.name);

  wallKickXOffset =
    rotationOffset[name][currentRotation][wallKickIndex][0] -
    rotationOffset[name][nextRotation][wallKickIndex][0];
  wallKickYOffset =
    rotationOffset[name][currentRotation][wallKickIndex][1] -
    rotationOffset[name][nextRotation][wallKickIndex][1];

  for (let i = 0; i < nextRotationTetromino.length; i++) {
    const x = nextRotationTetromino[i][0] + currentShape.x + wallKickXOffset;
    const y = nextRotationTetromino[i][1] + currentShape.y + wallKickYOffset;

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
  const type = currentShape.tetromino.type;
  const tetromino = getCurrentTetromino();

  for (let i = 0; i < tetromino.length; i++) {
    const x = tetromino[i][0] + currentShape.x;
    const y = tetromino[i][1] + currentShape.y;

    matrix[y][x] = type;
  }
}

function updateLines() {
  const filledLines = getFilledLines();

  game.lines += filledLines.length;
}

// TODO: scoring system not yet
// doc: https://tetris.wiki/Scoring#Recent_guideline_compatible_games
// just single-tetris
function updateScore() {
  const scoreArray = [100, 300, 500, 800];
  const filledLines = getFilledLines();

  if (!filledLines.length) return;

  game.score += scoreArray[filledLines.length - 1] * game.level;
}

// HACK: setup for highest level
function updateLevel() {
  if (game.level === 25) return;

  const oldLevel = game.level - 1;
  const increased = Math.floor(game.lines / 10);

  if (oldLevel !== increased) {
    game.level += 1;
  }
}

function clearFilledLines() {
  const filledLines = getFilledLines();

  if (!filledLines.length) return;

  for (let i = 0; i < filledLines.length; i++) {
    matrix.splice(filledLines[i], 1);
    matrix.unshift(new Array(10).fill(0));
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

function drawPlayfield() {
  clearCanvas();
  drawMatrix();
  drawGhostPiece();
  drawCurrentTetromino();
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

      ctx.value.fillStyle = palette.tetrominoColor[matrix[y][x] - 1];
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
  if (!JSON.parse(game.isDrawGhostPiece)) return;

  const tetromino = game.currentTetromino;
  const color = palette.previewColor;
  const ghostPieceYOffset = getGhostPieceYOffset(tetromino.y);
  const piece = tetromino.pieces[tetromino.rotation];

  ctx.value.fillStyle = color;
  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][0] + tetromino.x;
    const y = piece[i][1] + ghostPieceYOffset;

    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}

function drawCurrentTetromino() {
  const tetromino = game.currentTetromino;
  const color = tetromino.color;
  const piece = tetromino.pieces[tetromino.rotation];

  ctx.value.fillStyle = color;
  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][0] + tetromino.x;
    const y = piece[i][1] + tetromino.y;
    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block);
  }
}

function getGhostPieceYOffset(offset) {
  const tetromino = game.currentTetromino;
  const piece = tetromino.pieces[tetromino.rotation];
  const h = matrix.length - 2;

  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][0] + tetromino.x;
    const y = piece[i][1] + offset;

    if (offset >= tetromino.y && (y > h || (matrix[y] && matrix[y + 1][x]))) {
      return offset;
    }
  }
  return getGhostPieceYOffset(offset + 1);
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
