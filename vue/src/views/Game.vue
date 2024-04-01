<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { useGameStore } from "@/stores/game.js";

import { socket } from "@/assets/js/socket.js";
import { getShape } from "@/assets/js/shape.js";
import { palettes } from "@/assets/js/palettes.js";
import { preventZoom, forEachShape } from "@/assets/js/utils.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import GamePrepare from "@/components/GamePrepare.vue";
import GameInfo from "@/components/GameInfo.vue";
import Button from "@/components/Button.vue";
import Canvas from "@/components/Canvas.vue";
import GameOverInfo from "@/components/GameOverInfo.vue";

const route = useRoute();
const gameMode = ref(route.params.mode);

const game = useGameStore();
const {
  map,
  currentShape,
  previewShape,
  nextShape,
  showSparator,
  highScore,
  room,
} = storeToRefs(game);

const mapCanvas = ref(null);
const nextCanvas = ref(null);

const score = ref(0);
const level = ref(1);

const gamePlay = ref(false);
const gameOver = ref(false);

const filledRows = [];

const volumeUp = ref(true);

const readyStatus = ref(false);
const showPrepare = ref(false);
const prepared = ref(0);
const scoreDiff = ref(0);

let drop = false;
let down = false;
let dropTimer = null;

onMounted(() => {
  // preventZoom();

  if (checkGameMode("2p")) {
    showPrepare.value = true;
  }
});

onBeforeRouteLeave(() => {
  replayGame();
});

socket.on("onePlayerReady", () => {
  prepared.value = 1;
});

socket.on("twoPlayerReady", () => {
  prepared.value = 2;

  socket.emit("startGame", {
    room: game.room,
    gameStart: true,
  });
});

socket.on("twoStartGame", () => {
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

function playGame() {
  gamePlay.value = !gamePlay.value;

  if (!dropTimer) addShape();
  if (gamePlay.value) setDropTimer();
  if (!gamePlay.value && dropTimer) clearInterval(dropTimer);
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
    showSparator: false,
  });

  gamePlay.value = false;
  gameOver.value = false;
  score.value = 0;
  level.value = 1;

  filledRows.length = 0;

  mapCanvas.value.clearMap();
  nextCanvas.value.drawNextShape();
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
        showSparator: true,
        currentShape: null,
        previewShape: null,
        nextShape: null,
      });

      clearInterval(dropTimer);
      dropTimer = null;

      if(checkGameMode('2p')) {
        socket.emit("gameOver", {
          room: game.room,
          gameOver: true,
        })
        return
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

    if (checkGameMode("2p")) {
      socket.emit("updateScore", {
        room: game.room,
        score: score.value,
      });
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
  const m = map.value;

  filledRows.length = 0; // clear array

  for (let i = 0; i < m.length; i++) {
    if (m[i].every((item) => !!item)) {
      filledRows.push(i);
    }
  }
}

function checkGameMode(mode) {
  return gameMode.value === mode;
}

function readyGame(status) {
  if (!status) prepared.value = 0;

  readyStatus.value = status;

  socket.emit("ready", {
    room: room.value,
    ready: readyStatus.value,
  });
}
</script>

<template>
  <Header>
    <Menu :playStatus="gamePlay" @play="playGame" />
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
        <div
          :class="scoreDiff >= 0 ? 'text-nes-deep-green' : 'text-nes-deep-red'"
          v-if="checkGameMode('2p')"
        >
          {{ scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff }}
        </div>
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
          description="primary"
          :icon="
            gamePlay
              ? 'icon-[pixelarticons--pause]'
              : 'icon-[pixelarticons--play]'
          "
          v-if="checkGameMode('1p')"
          @click.prevent="playGame"
        />
        <Button
          description="primary"
          icon="icon-[pixelarticons--reload]"
          v-if="checkGameMode('1p')"
          @click.prevent="replayGame"
        />
        <Button
          description="primary"
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

  <GamePrepare
    :status="readyStatus"
    :prepared="prepared"
    v-if="showPrepare"
    @ready="readyGame(true)"
    @cancel="readyGame(false)"
  />
  <GameOverInfo
    :score="score"
    :highScore="highScore"
    v-if="gameOver"
    @replay="replayGame"
  />
</template>
