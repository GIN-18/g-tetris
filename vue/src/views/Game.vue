<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useGameStore } from "@/stores/game.js";

import { getShape } from "@/assets/js/shape.js";
import { socket, emitEvent } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";
import { preventZoom, forEachShape } from "@/assets/js/utils.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import GamePrepare from "@/components/GamePrepare.vue";
import GameInfo from "@/components/GameInfo.vue";
import Button from "@/components/button/Button.vue";
import ArrowButton from "@/components/button/ArrowButton.vue";
import StatusButton from "@/components/button/StatusButton.vue";
import Canvas from "@/components/Canvas.vue";
import GameOverInfo from "@/components/GameOverInfo.vue";

const route = useRoute();
const router = useRouter();
const gameMode = ref(route.params.mode);

const game = useGameStore();
const { map, currentShape, previewShape, nextShape, highScore } =
  storeToRefs(game);

const mapCanvas = ref(null);
const nextCanvas = ref(null);

const score = ref(0);
const level = ref(1);

const gamePlay = ref(false);
const gameOver = ref(false);
const gameOverTitle = ref("GAME OVER");

const volumeUp = ref(true);

const readyStatus = ref(false);
const showPrepare = ref(false);
const prepared = ref(0);
const scoreDiff = ref(0);
const againStatus = ref(0);

const filledRows = [];

let drop = false;
let down = false;
let dropTimer = null;

const formatScoreDiff = computed(() =>
  scoreDiff.value >= 0 ? `+${scoreDiff.value}` : scoreDiff.value,
);

const scoreDiffColor = computed(() =>
  scoreDiff.value >= 0 ? "text-nes-deep-green" : "text-nes-deep-red",
);

onMounted(() => {
  // preventZoom();

  if (checkGameMode("2p")) {
    showPrepare.value = true;
  }
});

onBeforeRouteLeave(() => {
  if (checkGameMode("2p")) return;

  replayGame();
});

socket.on("onePlayerReady", () => {
  prepared.value = 1;
});

socket.on("twoPlayerReady", () => {
  prepared.value = 2;
  showPrepare.value = false;
  playGame();
});

socket.on("scoreUpdated", (data) => {
  const scoreArray = [];

  for (let item in data) {
    if (item === socket.id) {
      scoreArray[0] = data[item].score;
    } else {
      scoreArray[1] = data[item].score;
    }
  }

  scoreDiff.value = scoreArray[0] - scoreArray[1];
});

socket.on("onePlayerGameOver", (data) => {
  if (!data[socket.id].gameOver) notify("warning", "1P GAME OVER!!");
});

socket.on("twoPlayerGameOver", () => {
  if (scoreDiff.value > 0) {
    gameOverTitle.value = "VICTORY";
  } else if (scoreDiff.value < 0) {
    gameOverTitle.value = "TRY AGAIN";
  }
});

socket.on("onePlayerAgain", () => {
  againStatus.value = 1;
});

socket.on("twoPlayerAgain", () => {
  againStatus.value = 2;
  playGame();
});

function playGame() {
  gamePlay.value = !gamePlay.value;

  if (!dropTimer) addShape();
  if (gamePlay.value) setDropTimer();
  if (!gamePlay.value && dropTimer) clearInterval(dropTimer);

  if (checkGameMode("2p")) {
    emitEvent("again", "again", false);
  }
}

function replayGame() {
  if (dropTimer) {
    clearInterval(dropTimer);
    dropTimer = null;
  }

  game.$patch({
    map: new Array(20).fill(0).map(() => new Array(10).fill(0)),
    currentShape: null,
    previewShape: null,
    nextShape: getShape(),
  });

  gamePlay.value = false;
  gameOver.value = false;
  score.value = 0;
  level.value = 1;

  scoreDiff.value = 0;

  filledRows.length = 0;

  mapCanvas.value.clearMap();
  nextCanvas.value.drawNextShape();

  if (checkGameMode("2p")) {
    emitEvent("again", "again", true);
  }
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
      gameOver.value = true;
      gamePlay.value = false;

      game.$patch({
        currentShape: null,
        previewShape: null,
        nextShape: null,
      });

      clearInterval(dropTimer);
      dropTimer = null;

      if (checkGameMode("2p")) {
        againStatus.value = 0;
        emitEvent("gameOver", "gameOver", true);
        return;
      }

      updateHighScore();

      return;
    }
  }

  if (currentShape.value) mapCanvas.value.drawGame();
  nextCanvas.value.drawNextShape();
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

// HACK: rotate shape against the wall
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

  mapCanvas.value.drawGame();
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
    mapCanvas.value.drawGame();
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
    y,
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

    if (checkGameMode("2p")) {
      emitEvent("updateScore", "score", score.value);
    }
  }
}

function updateHighScore() {
  if (score.value >= highScore.value) {
    localStorage.setItem("highScore", score.value);
  }
  highScore.value = localStorage.getItem("highScore");
}

function updateLevel() {
  let nextLevelScore = (level.value + 1) * 100 * level.value;

  while (score.value >= nextLevelScore) {
    level.value++;
    nextLevelScore = (level.value + 1) * 100 * level.value;
  }
}

function getFilledRows() {
  filledRows.length = 0;

  for (let i = 0; i < map.value.length; i++) {
    if (map.value[i].every((item) => !!item)) {
      filledRows.push(i);
    }
  }
}

// TODO: toggle volume
function toggleVolume() {
  volumeUp.value = !volumeUp.value;
}

function checkGameMode(mode) {
  return gameMode.value === mode;
}

// HACK: client and server all not good
function readyGame() {
  readyStatus.value = !readyStatus.value;

  if (!readyStatus.value) prepared.value = 0;

  emitEvent("ready", "ready", readyStatus.value);
}

function quitGame() {
  router.push({
    path: "/",
  });
}
</script>

<template>
  <Header>
    <Menu :playStatus="gamePlay" @play="playGame" v-if="checkGameMode('1p')" />
  </Header>

  <main class="flex justify-between items-center w-full">
    <Canvas ref="mapCanvas" name="map" width="200" height="400" />
    <div class="flex flex-col justify-between items-center h-full">
      <GameInfo title="SCORE">
        <span>{{ score }}</span>
      </GameInfo>
      <GameInfo title="HI-SCORE" v-if="checkGameMode('1p')">
        <span>{{ highScore }}</span>
      </GameInfo>
      <GameInfo title="SCORE DIFF" v-if="checkGameMode('2p')">
        <span :class="scoreDiffColor">
          {{ formatScoreDiff }}
        </span>
      </GameInfo>
      <GameInfo title="NEXT">
        <Canvas ref="nextCanvas" name="next" width="80" height="40" />
      </GameInfo>
      <GameInfo title="LEVEL">
        <span>{{ level }}</span>
      </GameInfo>
    </div>
  </main>

  <hr class="w-full border-t-4 border-dashed border-black" />

  <div class="flex w-full">
    <!-- arrow button -->
    <div class="flex flex-col justify-center items-center w-1/2">
      <ArrowButton type="drop" @click.prevent="moveShapeDown('drop', true)" />
      <div class="flex justify-between items-center w-full">
        <ArrowButton type="left" @click.prevent="moveShape(-1, 0)" />
        <ArrowButton type="right" @click.prevent="moveShape(1, 0)" />
      </div>
      <ArrowButton
        type="down"
        @touchstart.prevent="moveShapeDown('down', true)"
        @touchend.prevent="moveShapeDown('down', false)"
      />
    </div>

    <div class="flex flex-col justify-between items-end w-1/2">
      <!-- feature button -->
      <div class="flex gap-4">
        <StatusButton
          :status="gamePlay"
          trueIcon="icon-[pixelarticons--pause]"
          falseIcon="icon-[pixelarticons--play]"
          v-if="checkGameMode('1p')"
          @toggle="playGame"
        />
        <Button
          type="primary"
          icon="icon-[pixelarticons--reload]"
          v-if="checkGameMode('1p')"
          @click.prevent="replayGame"
        />
        <StatusButton
          :status="volumeUp"
          trueIcon="icon-[pixelarticons--volume-vibrate]"
          falseIcon="icon-[pixelarticons--volume-x]"
          @toggle="toggleVolume"
        />
      </div>

      <!-- rotate button -->
      <ArrowButton type="rotate" @click.prevent="rotateShape" />
    </div>
  </div>

  <GamePrepare
    :status="readyStatus"
    :prepared="prepared"
    :showPrepare="showPrepare"
    @ready="readyGame"
    @quit="quitGame"
  />

  <GameOverInfo
    :gameOver="gameOver"
    :title="gameOverTitle"
    :gameMode="gameMode"
    :score="score"
    :highScore="highScore"
    :scoreDiff="scoreDiff"
    :again="againStatus"
    @replay="replayGame"
    @quit="quitGame"
  />
</template>
