<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { createShape } from "@/assets/js/shape.js";
import { socketEmit } from "@/assets/js/socket.js";
import { emitter } from "@/assets/js/emitter.js";
import { palettes } from "@/assets/js/palettes.js";
import { checkGameMode } from "@/assets/js/utils.js";

// get canvas info
const canvas = ref(null);
const canvasWidth = computed(() => canvas.value.width);
const canvasHeight = computed(() => canvas.value.height);
const ctx = computed(() => canvas.value.getContext("2d"));

const game = useGameStore();
const block = 20;
const filledRows = [];
let map = new Array(20).fill(0).map(() => new Array(10).fill(0));
let currentShape = null;
let previewShape = null;
let dropTimer = null;
let drop = false;
let down = false;

// redraw canvas when preview toggles
watch(
  () => game.isPreview,
  () => {
    if (!previewShape) return;

    clearCanvas();
    drawMap();
    drawPreviewPiece();
    drawCurrentPiece();
  },
);

onMounted(() => {
  emitter.on("drop", dropPiece);
  emitter.on("left", movePieceLeft);
  emitter.on("right", movePieceRight);
  emitter.on("down", (enable) => movePieceDown(enable));
  emitter.on("play", playGame);
  emitter.on("reset", resetGame);
  emitter.on("volume", toggleVolume);
  emitter.on("rotate", rotatePiece);
});

onUnmounted(() => {
  emitter.off("drop", dropPiece);
  emitter.off("left", movePieceLeft);
  emitter.off("right", movePieceRight);
  emitter.off("down", (enable) => movePieceDown(enable));
  emitter.off("play", playGame);
  emitter.off("reset", resetGame);
  emitter.off("volume", toggleVolume);
  emitter.off("rotate", rotatePiece);
});

function playGame() {
  game.gamePlay = !game.gamePlay;

  if (!dropTimer) addShape();
  if (game.gamePlay) setDropTimer();
  if (!game.gamePlay && dropTimer) clearInterval(dropTimer);
}

function resetGame() {
  if (!dropTimer) return;

  if (dropTimer) {
    clearInterval(dropTimer);
    dropTimer = null;
  }

  game.$patch({
    gamePlay: false,
    gameOver: false,
    level: 1,
    score: 0,
    scoreDiff: 0,
    nextShape: createShape(),
  });

  map = new Array(20).fill(0).map(() => new Array(10).fill(0));
  currentShape = null;
  previewShape = null;
  filledRows.length = 0;

  clearCanvas();
}

function addShape() {
  currentShape = game.nextShape;
  previewShape = { ...currentShape };
  game.nextShape = createShape();

  // game over
  const { x, y, type, pieces, rotation } = currentShape;
  const piece = pieces[rotation];

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + y + (type === 1 ? 1 : 2);

    if (map[tmp_y][tmp_x]) {
      clearInterval(dropTimer);

      game.gameOver = true;
      game.gamePlay = false;

      game.$patch({
        nextShape: null,
      });

      currentShape = null;
      previewShape = null;

      // NOTE: socket emit game over
      if (checkGameMode("2p")) {
        socketEmit("gameOver", "gameOver", true);
        return;
      }

      updateHighScore();

      return;
    }
  }

  drawGame();
}

function setDropTimer() {
  if (game.gameOver) return;

  let timestep = Math.round(10 + 800 * Math.pow(0.92, game.level - 1));

  if (drop) {
    timestep = 10;
  } else if (down) {
    timestep = Math.min(timestep, 80);
  }

  if (dropTimer) {
    clearInterval(dropTimer);
    dropTimer = null;
  }

  dropTimer = setInterval(() => {
    fallPieceToLand();
  }, timestep);
}

function fallPieceToLand() {
  if (movePiece(0, 1)) return;
  landPiece();
}

function landPiece() {
  if (drop) drop = false;

  mergePiece();
  getFilledRows();

  if (filledRows.length > 0) {
    clearFilledRows();
    updateScore();
    updateLevel();
  }

  addShape();
  setDropTimer();
}

function dropPiece() {
  if (!game.gamePlay) return;

  drop = true;

  setDropTimer();
}

function movePieceLeft() {
  if (!game.gamePlay) return;
  movePiece(-1, 0);
}

function movePieceRight() {
  if (!game.gamePlay) return;
  movePiece(1, 0);
}

// FIXME: shape can not be added when shape landed
function movePieceDown(enable) {
  if (!game.gamePlay) return;

  clearInterval(dropTimer);

  if (enable && !movePiece(0, 1)) return;

  down = enable;
  setDropTimer();
}

// HACK: rotate shape against the wall
function rotatePiece() {
  if (!game.gamePlay) return;

  const { x, y, pieces, rotation } = currentShape;
  const currentRotation = rotation;
  const resultRotation = (rotation + 1) % pieces.length;

  currentShape.rotation = resultRotation;
  previewShape.rotation = resultRotation;

  const piece = currentShape.pieces[currentShape.rotation];

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + y;

    if (
      tmp_y >= 0 &&
      (map[tmp_y] === undefined ||
        map[tmp_y][tmp_x] === undefined ||
        map[tmp_y][tmp_x] > 0)
    ) {
      currentShape.rotation = currentRotation;
      previewShape.rotation = currentRotation;
    }
  }

  drawGame();
}

function movePiece(xStep, yStep) {
  const { x, y, pieces, rotation } = currentShape;
  const piece = pieces[rotation];
  const w = map[0].length;
  const h = map.length;

  let canMove = true;

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x + xStep;
    const tmp_y = piece[i][0] + y + yStep;

    if (
      tmp_x < 0 ||
      tmp_x >= w ||
      tmp_y >= h ||
      (map[tmp_y] && map[tmp_y][tmp_x])
    ) {
      canMove = false;
      return canMove;
    }
  }

  if (canMove) {
    currentShape.x += xStep;
    currentShape.y += yStep;
    previewShape.x += xStep;
    drawGame();
  }

  return canMove;
}

function mergePiece() {
  const { x, y, type, pieces, rotation } = currentShape;
  const piece = pieces[rotation];

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + y;

    if (tmp_y >= 0) map[tmp_y][tmp_x] = type + 1;
  }
}

function clearFilledRows() {
  for (let i = 0; i < filledRows.length; i++) {
    map.splice(filledRows[i], 1);
    map.unshift(new Array(10).fill(0));
  }
}

// HACK: limit the number of score
function updateScore() {
  if (filledRows.length > 0) {
    game.score +=
      (filledRows.length * game.level + (filledRows.length - 1)) * 10;

    // NOTE: socket emit update score
    if (checkGameMode("2p")) {
      socketEmit("updateScore", "score", game.score);
    }
  }
}

function updateHighScore() {
  if (game.score >= game.highScore) {
    localStorage.setItem("highScore", game.score);
  }
  game.highScore = localStorage.getItem("highScore");
}

// HACK: the value of next level score
function updateLevel() {
  let nextLevelScore = (game.level + 1) * 100 * game.level;

  while (game.score >= nextLevelScore) {
    game.level++;
    nextLevelScore = (game.level + 1) * 100 * game.level;
  }
}

function getFilledRows() {
  filledRows.length = 0;

  for (let i = 0; i < map.length; i++) {
    if (map[i].every((item) => !!item)) {
      filledRows.push(i);
    }
  }
}

function drawGame() {
  clearCanvas();
  drawMap();
  drawPreviewPiece();
  drawCurrentPiece();
}

function clearCanvas() {
  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
}

function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (!map[y][x]) continue;

      ctx.value.fillStyle = palettes[game.palette].shapeColor[map[y][x] - 1];
      ctx.value.fillRect(x * block, y * block, block, block);
    }
  }
}

function drawCurrentPiece() {
  const { x, y, type, pieces, rotation } = currentShape;
  const piece = pieces[rotation];

  ctx.value.fillStyle = palettes[game.palette].shapeColor[type];
  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + y;
    ctx.value.fillRect(tmp_x * block, tmp_y * block, block, block);
  }
}

function drawPreviewPiece() {
  if (!JSON.parse(game.isPreview)) return;

  const { x, y, pieces, rotation } = previewShape;
  const piece = pieces[rotation];
  const previewPieceFinalY = getPreviewPieceYOffset(y);

  ctx.value.fillStyle = palettes[game.palette].previewShapeColor;

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + previewPieceFinalY;
    ctx.value.fillRect(tmp_x * block, tmp_y * block, block, block);
  }

  function getPreviewPieceYOffset(offset) {
    for (let i = 0; i < piece.length; i++) {
      const tmp_x = piece[i][1] + x;
      const tmp_y = piece[i][0] + offset;

      if (
        offset >= currentShape.y &&
        (tmp_y > map.length - 2 || (map[tmp_y] && map[tmp_y + 1][tmp_x]))
      ) {
        return offset;
      }
    }

    return getPreviewPieceYOffset(offset + 1);
  }
}

// TODO: play the sound
function toggleVolume() {
  game.volumeUp = !game.volumeUp;
}
</script>

<template>
  <canvas
    class="border-4 border-black bg-black"
    width="200"
    height="400"
    ref="canvas"
  ></canvas>
</template>
