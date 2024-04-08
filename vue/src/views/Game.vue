<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game.js";

import { getShape } from "@/assets/js/shape.js";
import { socket, socketEmit } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";
import { preventZoom, forEachShape } from "@/assets/js/utils.js";
import { playConfetti } from "@/assets/js/confetti.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import Canvas from "@/components/Canvas.vue";
import GameInfo from "@/components/GameInfo.vue";
import Button from "@/components/button/Button.vue";
import ArrowButton from "@/components/button/ArrowButton.vue";
import StatusButton from "@/components/button/StatusButton.vue";
import GamePrepare from "@/components/GamePrepare.vue";
import GameOverInfo from "@/components/GameOverInfo.vue";

const route = useRoute();
const router = useRouter();

const game = useGameStore();
const { currentShape, previewShape, nextShape, isPreview, highScore, palette } =
  storeToRefs(game);

const gameMode = route.params.mode;

const mapCanvas = ref(null);
const nextCanvas = ref(null);

const score = ref(0);
const level = ref(1);

const gamePlay = ref(false);
const gameOver = ref(false);
const gameOverTitle = ref("GAME OVER");

const volumeUp = ref(true);

const scoreDiff = ref(0);
const win = ref(false);
const lose = ref(false);

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
    isPreview.value = false; // 2p mode is always not preview

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

    socket.on("oneGameOver", () => {
      if (!data[socket.id].gameOver) notify("warning", "2P GAME OVER!!");
    });

    socket.on("twoGameOver", () => {
      if (scoreDiff.value > 0) {
        gameOverTitle.value = "VICTORY";
        win.value = true;
        playConfetti(palette.value);
      } else if (scoreDiff.value < 0) {
        gameOverTitle.value = "TRY AGAIN";
        lose.value = true;
      }
    });

    socket.on("replay", () => {
      replayGame();
      playGame();
    });
  }
});

onBeforeRouteLeave(() => {
  if (checkGameMode("2p")) return;

  replayGame();
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
  });

  gamePlay.value = false;
  gameOver.value = false;
  score.value = 0;
  level.value = 1;

  scoreDiff.value = 0;
  win.value = false;
  lose.value = false;

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

    if (game.map[y][x]) {
      gameOver.value = true;
      gamePlay.value = false;

      game.$patch({
        currentShape: null,
        previewShape: null,
        nextShape: null,
      });

      clearInterval(dropTimer);
      dropTimer = null;

      if (checkGameMode("1p")) updateHighScore();

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

// FIXME: shape can not be added when shape landed
function moveDown(enable) {
  clearInterval(dropTimer);
  if (enable && !moveShape(0, 1)) return;

  down = enable;
  setDropTimer();
}

function dropShape() {
  drop = true;
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
      (game.map[y] === undefined ||
        game.map[y][x] === undefined ||
        game.map[y][x] > 0)
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
  const m = game.map;
  const w = game.map[0].length;
  const h = game.map.length;

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
      if (y >= 0) game.map[y][x] = type + 1;
    },
    x,
    y,
  );
}

function cleanFilledRows() {
  for (let i = 0; i < filledRows.length; i++) {
    game.map.splice(filledRows[i], 1);
    game.map.unshift(new Array(10).fill(0));
  }
}

// HACK: limit the number of score
function updateScore() {
  if (score.value >= 99999999) return;

  if (filledRows.length > 0) {
    score.value +=
      (filledRows.length * level.value + (filledRows.length - 1)) * 10;

    if (checkGameMode("2p")) {
      socketEmit("updateScore", "score", score.value);
    }
  }
}

function updateHighScore() {
  if (score.value >= highScore.value) {
    localStorage.setItem("highScore", score.value);
  }
  highScore.value = localStorage.getItem("highScore");
}

// HACK: limit the number of level
function updateLevel() {
  let nextLevelScore = (level.value + 1) * 100 * level.value;

  while (score.value >= nextLevelScore) {
    level.value++;
    nextLevelScore = (level.value + 1) * 100 * level.value;
  }
}

function getFilledRows() {
  filledRows.length = 0;

  for (let i = 0; i < game.map.length; i++) {
    if (game.map[i].every((item) => !!item)) {
      filledRows.push(i);
    }
  }
}

// TODO: toggle volume
function toggleVolume() {
  volumeUp.value = !volumeUp.value;
}

function checkGameMode(mode) {
  return gameMode === mode;
}

function againGame() {
  replayGame();
  playGame();
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

    <!-- game info -->
    <div class="flex flex-col justify-between items-center w-max-40 h-full">
      <!-- game score -->
      <GameInfo title="SCORE">
        <span>{{ score }}</span>
      </GameInfo>

      <!-- HACK: component or v-if here (high score and score difference) -->
      <!-- high score -->
      <GameInfo title="HI-SCORE" v-if="checkGameMode('1p')">
        <span>{{ highScore }}</span>
      </GameInfo>

      <!-- socre difference -->
      <GameInfo title="DIFF" v-if="checkGameMode('2p')">
        <span :class="scoreDiffColor">
          {{ formatScoreDiff }}
        </span>
      </GameInfo>

      <!-- next shape -->
      <GameInfo title="NEXT">
        <Canvas ref="nextCanvas" name="next" width="80" height="40" />
      </GameInfo>

      <!-- game level -->
      <GameInfo title="LEVEL">
        <span>{{ level }}</span>
      </GameInfo>
    </div>
  </main>

  <hr class="w-full border-t-4 border-dashed border-black" />

  <div class="flex w-full">
    <!-- arrow button -->
    <div class="flex flex-col justify-center items-center w-1/2">
      <!-- drop button -->
      <ArrowButton type="drop" @click.prevent="dropShape" />

      <!-- left and right button -->
      <div class="flex justify-between items-center w-full">
        <ArrowButton type="left" @click.prevent="moveShape(-1, 0)" />
        <ArrowButton type="right" @click.prevent="moveShape(1, 0)" />
      </div>

      <!-- down button -->
      <ArrowButton
        type="down"
        @touchstart.prevent="moveDown(true)"
        @touchend.prevent="moveDown(false)"
      />
    </div>

    <div class="flex flex-col justify-between items-end w-1/2">
      <!-- feature button -->
      <div class="flex gap-4">
        <!-- play game button -->
        <StatusButton
          :status="gamePlay"
          trueIcon="icon-[pixelarticons--pause]"
          falseIcon="icon-[pixelarticons--play]"
          v-if="checkGameMode('1p')"
          @toggle="playGame"
        />

        <!-- replay game button -->
        <Button
          type="primary"
          icon="icon-[pixelarticons--reload]"
          v-if="checkGameMode('1p')"
          @click.prevent="replayGame"
        />

        <!-- toggle volume button -->
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

  <GamePrepare :gameMode="gameMode" @ready="playGame" @quit="quitGame" />

  <GameOverInfo
    :gameOver="gameOver"
    :title="gameOverTitle"
    :gameMode="gameMode"
    :score="score"
    :highScore="highScore"
    :scoreDiff="scoreDiff"
    :win="win"
    :lose="lose"
    @replay="againGame"
    @quit="quitGame"
  />
</template>
