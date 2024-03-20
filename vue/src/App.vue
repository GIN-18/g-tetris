<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "./stores/game.js";

import { getShape } from "@/assets/js/shape.js";
import { palettes } from "@/assets/js/palettes.js";
import { forEachShape } from "@/assets/js/utils.js";

import Logo from "@/components/Logo.vue";
import Menu from "@/components/Menu.vue";
import Info from "@/components/Info.vue";
import Button from "@/components/Button.vue";
import MapCanvas from "@/components/MapCanvas.vue";
import NextCanvas from "@/components/NextCanvas.vue";
import Sparator from "@/components/Sparator.vue";
import GameOverInfo from "@/components/GameOverInfo.vue";

const game = useGameStore();
const { map, currentShape, previewShape, nextShape, showSparator } =
  storeToRefs(game);

const mapCanvas = ref(null);
const nextCanvas = ref(null);

const score = ref(0);
const highScore = localStorage.getItem('highScore') || 0;
const level = ref(1);

const filledRows = [];

let gamePlay = ref(false);
let gameOver = ref(false);

let dropTimer = null;
let drop = false;
let down = false;

let volumeUp = true;

function playGame() {
  gamePlay.value = !gamePlay.value;

  if (!dropTimer) addShape();
  if (gamePlay.value) setDropTimer();
  if (!gamePlay.value && dropTimer) {
    clearInterval(dropTimer);
    dropTimer = null;
  }
}

function replayGame() {
  if (dropTimer) {
    clearInterval(dropTimer);
    dropTimer = null;
  }

  showSparator.value = false
  map.value = new Array(20).fill(0).map(() => new Array(10).fill(0));
  currentShape.value = null;
  previewShape.value = null;
  nextShape.value = getShape();
  score.value = 0;
  level.value = 1;
  filledRows.length = 0;
  gamePlay.value = false;
  gameOver.value = false;

  mapCanvas.value.clearMap();
  nextCanvas.value.drawShape();
}

function addShape() {
  currentShape.value = nextShape.value;
  previewShape.value = { ...currentShape.value };
  nextShape.value = getShape();

  const {
    type,
    pieces,
    rotation,
    x: currentX,
    y: currentY,
  } = currentShape.value;

  const cs = pieces[rotation];

  // game over
  for (let i = 0; i < cs.length; i++) {
    const x = cs[i][1] + currentX;
    const y = cs[i][0] + currentY + (type === 1 ? 1 : 2);

    if (map.value[y][x]) {
      showSparator.value = true

      gameOver.value = true;
      gamePlay.value = false;

      currentShape.value = null;
      previewShape.value = null;
      nextShape.value = null;

      clearInterval(dropTimer);
      dropTimer = null;

      updateHighScore()

      return;
    }
  }

  if(currentShape.value) mapCanvas.value.drawShape();
  nextCanvas.value.drawShape();
}

function setDropTimer() {
  if (gameOver.value) return;

  let timestep = Math.round(80 + 800 * Math.pow(0.75, level.value - 1));

  if (drop) {
    timestep = 10;
  } else if (down) {
    timestep = 80;
  } else {
    timestep = Math.max(10, timestep);
  }

  if (dropTimer) {
    clearInterval(dropTimer);
    dropTimer = null;
  }

  dropTimer = setInterval(() => {
    fallShape();
  }, timestep);
}

function fallShape() {
  if (moveShape(0, 1)) return;
  landShape();
}

function landShape() {
  if (drop) drop = false;

  mergeShape();
  getFilledRows();

  if (filledRows.length > 0) {
    cleanFilledRows();
    updateScore();
    updateLevel();
  }

  addShape();
  setDropTimer();
}

function moveShapeDown(direction, enable) {
  if (!gamePlay.value) return;

  if (direction === "down") {
    down = enable;
  } else {
    drop = enable;
  }

  setDropTimer();
}

function rotateShape() {
  if (!gamePlay.value) return;

  const {
    x: currentX,
    y: currentY,
    pieces: currentPieces,
    rotation: currentRotation,
  } = currentShape.value;

  const nowRotation = currentRotation;
  const resultRotation = (currentRotation + 1) % currentPieces.length;

  currentShape.value.rotation = resultRotation;
  previewShape.value.rotation = resultRotation;

  const currentPiece = currentShape.value.pieces[currentShape.value.rotation];

  for (let i = 0; i < currentPiece.length; i++) {
    const x = currentPiece[i][1] + currentX;
    const y = currentPiece[i][0] + currentY;

    if (
      y >= 0 &&
      (map.value[y] === undefined ||
        map.value[y][x] === undefined ||
        map.value[y][x] > 0)
    ) {
      currentShape.value.rotation = nowRotation;
      previewShape.value.rotation = nowRotation;
    }
  }

  mapCanvas.value.drawShape();
  mapCanvas.value.drawShape();
}

function moveShape(xStep, yStep) {
  if (!gamePlay.value) return;

  const {
    x: currentX,
    y: currentY,
    pieces: currentPieces,
    rotation: currentRotation,
  } = currentShape.value;

  const cs = currentPieces[currentRotation];
  const m = map.value;
  const w = map.value[0].length;
  const h = map.value.length;

  let canMove = true;

  for (let i = 0; i < cs.length; i++) {
    const x = cs[i][1] + currentX + xStep;
    const y = cs[i][0] + currentY + yStep;

    if (x < 0 || x >= w || y >= h || (m[y] && m[y][x])) {
      canMove = false;
      return canMove;
    }
  }

  if (canMove) {
    currentShape.value.x += xStep;
    currentShape.value.y += yStep;
    previewShape.value.x += xStep;
    mapCanvas.value.drawShape();
  }

  return canMove;
}

function mergeShape() {
  const { type, x, y } = currentShape.value;

  forEachShape(
    currentShape,
    (shape, x, y) => {
      if (y >= 0) map.value[y][x] = type + 1;
    },
    x,
    y
  );
}

function cleanFilledRows() {
  for (let i = 0; i < filledRows.length; i++) {
    map.value.splice(filledRows[i], 1);
    map.value.unshift(new Array(10).fill(0));
  }
}

function updateScore() {
  if (filledRows.length > 0) {
    score.value +=
      (filledRows.length * level.value + (filledRows.length - 1)) * 10;
  }
}

function updateHighScore() {
  if(score.value >= highScore) {
    highScore = localStorage.setItem('highScore', score.value)
  }
}

function updateLevel() {
  let nextLevelScore = (level.value + 1) * 100 * level.value;

  while (score.value >= nextLevelScore) {
    level.value++;
    nextLevelScore = (level.value + 1) * 100 * level.value;
  }
}

function getFilledRows() {
  const m = map.value;

  filledRows.length = 0; // clear array

  for (let i = 0; i < m.length; i++) {
    if (m[i].every((item) => !!item)) {
      filledRows.push(i);
    }
  }
}

onMounted(() => {
  document.body.classList.add("latte");
  // preventZoom();
});
</script>

<template>
  <div
    :class="[
      'flex',
      'flex-col',
      'justify-between',
      'w-full',
      'h-full',
      'p-2',
      'bg-nes-gray',
      showSparator ? 'blur-sm' : '',
    ]"
  >
    <header class="flex justify-between items-center">
      <Logo />
      <Menu />
    </header>

    <main class="flex justify-between items-center w-full">
      <mapCanvas ref="mapCanvas" />
      <div class="flex flex-col justify-between items-center h-full">
        <Info title="SCORE">
          <span>{{ score }}</span>
        </Info>
        <Info title="HI-SCORE">
          <span>{{ highScore }}</span>
        </Info>
        <Info title="NEXT">
          <NextCanvas ref="nextCanvas" />
        </Info>
        <Info title="LEVEL">
          <span>{{ level }}</span>
        </Info>
      </div>
    </main>

    <hr class="w-full border-t-4 border-dashed border-black" />

    <div class="flex">
      <div class="flex flex-col justify-center items-center w-1/2">
        <Button
          description="direction"
          icon="icon-[pixelarticons--arrow-bar-down]"
          @click.prevent="moveShapeDown('drop', true)"
        />
        <div class="flex justify-between items-center w-full">
          <Button
            description="direction"
            icon="icon-[pixelarticons--chevron-left]"
            @click.prevent="moveShape(-1, 0)"
          />
          <Button
            description="direction"
            icon="icon-[pixelarticons--chevron-right]"
            @click.prevent="moveShape(1, 0)"
          />
        </div>
        <Button
          description="direction"
          icon="icon-[pixelarticons--chevron-down]"
          @touchstart.prevent="moveShapeDown('down', true)"
          @touchend.prevent="moveShapeDown('down', false)"
        />
      </div>
      <div class="flex flex-col justify-between items-end w-1/2">
        <div class="flex gap-4">
          <Button
            description="box"
            :icon="
              gamePlay
                ? 'icon-[pixelarticons--pause]'
                : 'icon-[pixelarticons--play]'
            "
            @click.prevent="playGame"
          />
          <Button
            description="box"
            icon="icon-[pixelarticons--reload]"
            @click.prevent="replayGame"
          />
          <Button
            description="box"
            :icon="
              volumeUp
                ? 'icon-[pixelarticons--volume-vibrate]'
                : 'icon-[pixelarticons--volume-x]'
            "
          />
        </div>
        <Button
          description="rotate"
          icon="icon-[pixelarticons--redo]"
          @click.prevent="rotateShape"
        />
      </div>
    </div>
  </div>
  <Sparator />
  <GameOverInfo
    :score="score"
    :highScore="highScore"
    :gameOver="gameOver"
    @replay="replayGame"
  />
</template>
