<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "./stores/game.js";

import { getShape } from "@/assets/js/shape.js";
import { options } from "@/assets/js/options.js";
import { forEachShape } from "@/assets/js/utils.js";

import Logo from "@/components/Logo.vue";
import Info from "@/components/Info.vue";
import Button from "@/components/Button.vue";
import MapCanvas from "@/components/MapCanvas.vue";
import NextCanvas from "@/components/NextCanvas.vue";

const game = useGameStore();
const { map, currentShape, previewShape, nextShape } = storeToRefs(game);

const mapCanvas = ref(null);
const nextCanvas = ref(null);

const score = ref(0);
const hi_score = ref(0);
const level = ref(1);

const filledRows = []

let gamePlay = ref(false);
let gameOver = ref(false);

let dropTimer = 0;
let drop = false;
let down = false;

function playGame() {
  // gamePlay.value = !gamePlay.value;

  addShape();
  setDropTimer();
}

function moveShapeDown(direction, enable) {
  if (direction === "down") {
    down = enable;
  } else {
    drop = enable;
  }

  setDropTimer();
}

function addShape() {
  currentShape.value = nextShape.value;
  previewShape.value = { ...currentShape.value };
  nextShape.value = getShape();

  // game over
  forEachShape(
    currentShape,
    (shape, x, y) => {
      if (map.value[y] && map.value[y][x]) {
        gameOver.value = true;
      }
    },
    currentShape.value.x,
    currentShape.value.y
  );

  mapCanvas.value.drawShape(currentShape);
  mapCanvas.value.drawShape(previewShape);
  nextCanvas.value.drawShape(nextShape);
}

function setDropTimer() {
  let timestep = Math.round(80 + 800 * Math.pow(0.75, level.value - 1));

  if (drop) {
    timestep = 10;
  } else if (down) {
    timestep = 80;
  } else {
    timestep = Math.max(10, timestep);
  }

  if (dropTimer) {
    clearTimeout(dropTimer);
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
  getFilledRows()

  if (filledRows.length > 0) {
    cleanFilledRows();
  }

  addShape();
  setDropTimer();
}

function rotateShape() {
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

  mapCanvas.value.drawShape(currentShape);
  mapCanvas.value.drawShape(previewShape);
}

function moveShape(xStep, yStep) {
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
    mapCanvas.value.drawShape(currentShape);
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

function updateLevel() {
  if (level.value >= 40) return;

  let nextLevelScore = level.value + 1 + 100 * level.value;

  while (score.value >= nextLevelScore) {
    level.value++;
    nextLevelScore = level.value + 1 + 100 * level.value;
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
  document.body.classList.add("mocha");
  // preventZoom();
});
</script>

<template>
  <header>
    <Logo />
  </header>

  <main>
    <div class="flex justify-around items-center w-full h-full">
      <mapCanvas ref="mapCanvas" />
      <div class="flex flex-col justify-between items-center h-full">
        <Info title="SCORE">
          <span>{{ score }}</span>
        </Info>
        <Info title="HI-SCORE">
          <span>{{ hi_score }}</span>
        </Info>
        <Info title="NEXT">
          <NextCanvas ref="nextCanvas" />
        </Info>
        <Info title="LEVEL">
          <span>{{ level }}</span>
        </Info>
      </div>
    </div>
  </main>

  <hr class="w-full border-t-2 border-dashed border-text" />

  <div class="flex">
    <div class="flex flex-col justify-center items-center w-1/2">
      <Button
        description="direction"
        icon="icon-[material-symbols--arrow-downward-alt-rounded]"
        @click.prevent="moveShapeDown('drop', true)"
      />
      <div class="flex justify-between w-full">
        <Button
          description="direction"
          icon="icon-[material-symbols--arrow-left-rounded]"
          @click.prevent="moveShape(-1, 0)"
        />
        <Button
          description="direction"
          icon="icon-[material-symbols--arrow-right-rounded]"
          @click.prevent="moveShape(1, 0)"
        />
      </div>
      <Button
        description="direction"
        icon="icon-[material-symbols--arrow-drop-down-rounded]"
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
              ? 'icon-[material-symbols--pause-rounded]'
              : 'icon-[material-symbols--play-arrow-rounded]'
          "
          @click.prevent="playGame"
        />
        <Button
          description="box"
          icon="icon-[material-symbols--replay-rounded]"
        />
        <Button
          description="box"
          icon="icon-[material-symbols--volume-up-rounded]"
        />
      </div>
      <Button
        description="rotate"
        icon="icon-[material-symbols--rotate-right-rounded]"
        @click.prevent="rotateShape"
      />
    </div>
  </div>
</template>
