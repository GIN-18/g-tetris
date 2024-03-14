<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "./stores/game.js";

import { getShape } from "@/assets/js/shape.js";
import { preventZoom, forEachShape } from "@/assets/js/utils.js";
import { options } from "@/assets/js/options.js";

import Logo from "@/components/Logo.vue";
import Info from "@/components/Info.vue";
import Button from "@/components/Button.vue";
import MapCanvas from "@/components/MapCanvas.vue";
import NextCanvas from "@/components/NextCanvas.vue";

const game = useGameStore();
const { map, currentShape, nextShape } = storeToRefs(game);

const mapCanvas = ref(null);
const nextCanvas = ref(null);

const score = ref(0);
const hi_score = ref(0);
const level = ref(1);

let gamePlay = ref(false);
let gameOver = ref(false);

let canMove = true;
let shapeLand = false

let dropTimer = ref(0);

let fastForward = 0;

function playGame() {
  gamePlay.value = !gamePlay.value;

  if (!gamePlay.value) {
    return;
  }

  addShape();
  setDropTimer();
}

function addShape() {
  currentShape.value = nextShape.value;
  nextShape.value = getShape();

  forEachShape(
    currentShape,
    (shape, x, y) => {
      // game over
      if (map.value[y] && map.value[y][x]) {
        gameOver.value = true;
        console.log('game over')
      }
    },
    currentShape.value.x,
    currentShape.value.y + 1,
  );

  if (gameOver.value) return;

  mapCanvas.value.drawShape(currentShape);
  nextCanvas.value.drawShape(nextShape);
}

function setDropTimer() {
  let timestep = Math.round(80 + 800 * Math.pow(0.75, level.value - 1));

  fastForward ? (timestep = 80) : (timestep = Math.max(10, timestep));

  if (dropTimer.value) {
    clearTimeout(dropTimer.value);
  }

  dropTimer.value = setInterval(() => {
    fallShape();
  }, timestep);
}

function fallShape() {
  if (!shapeLand) {
    moveShape(0, 1);
    return;
  }
  landShape();
}

function landShape() {
  shapeLand = false
  mergeShape();
  addShape();

  // const filledRows = getFilledRows();
  //
  // if (filledRows.length > 0) {
  //   cleanFilledRows();
  // } else {
  //   addShape();
  // }
}

function rotateShape() {
  const currentRotation = currentShape.value.rotation;
  const tempRotation = (currentShape.value.rotation += 1);

  const resultRotation = tempRotation % currentShape.value.pieces.length;

  currentShape.value.rotation = resultRotation;
  mapCanvas.value.drawShape(currentShape);
}

function moveShape(xStep, yStep) {
  const w = map.value[0].length;
  const h = map.value.length;

  canMove = true

  forEachShape(
    currentShape,
    (shape, x, y) => {
      if (x < 0 || x >= w || y >= h || (map.value[y] && map.value[y][x])) {
        canMove = false;
      }

      if(y >= h || (map.value[y] && map.value[y][x])) {
        shapeLand = true
      }
    },
    currentShape.value.x + xStep,
    currentShape.value.y + yStep
  )

  if (canMove) {
    currentShape.value.x += xStep;
    currentShape.value.y += yStep;
    mapCanvas.value.drawShape(currentShape);
  }
}

function mergeShape() {
  const t = currentShape.value.type;

  forEachShape(
    currentShape,
    (shape, x, y) => {
      if (y >= 0) map.value[y][x] = t + 1;
    },
    currentShape.value.x,
    currentShape.value.y,
  );
}

function cleanFilledRows() {
  const filledRows = getFilledRows();

  for (let i = 0; i < filledRows.length; i++) {
    map.value.splice(filledRows[i], 1);
    map.value.unshift(new Array(map.value[0].length).fill(0));
  }

  updateScore(filledRows);
  updateLevel();
}

function updateScore(filledRows) {
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
  let filledRows = [];
  for (let i = 0; i < map.value.length; i++) {
    if (map.value[i].every((item) => !!item)) {
      filledRows.push(i);
    }
  }
  return filledRows;
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
        @touchstart.prevent="moveShapeDown('drop')"
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
        @touchstart.prevent="moveShapeDown('down')"
        @touchend.prevent="moveShapeDown('stop')"
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
