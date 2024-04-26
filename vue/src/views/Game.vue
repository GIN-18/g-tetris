<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { useGameStore } from "@/stores/game.js";
import { createShape } from "@/assets/js/shape.js";
import { socket, socketEmit } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";
import { emitter } from "@/assets/js/emitter.js";
import { playConfetti } from "@/assets/js/confetti.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import MapCanvas from "@/components/canvas/MapCanvas.vue";
import GameBaseInfo from "@/components/info/GameBaseInfo.vue";
import Button from "@/components/button/Button.vue";
import ArrowButton from "@/components/button/ArrowButton.vue";
import StatusButton from "@/components/button/StatusButton.vue";
import GameOverInfo from "@/components/info/GameOverInfo.vue";
import GamePrepareInfo from "@/components/info/GamePrepareInfo.vue";

const route = useRoute();
const game = useGameStore();
const {
  currentShape,
  previewShape,
  nextShape,
  isPreview,
  score,
  level,
  highScore,
  scoreDiff,
  palette,
} = storeToRefs(game);

const gameMode = route.params.mode;

const gamePlay = ref(false);
const gameOver = ref(false);
const gameOverTitle = ref("GAME OVER");

const volumeUp = ref(true);

const win = ref(false);
const lose = ref(false);

const filledRows = [];

let drop = false;
let down = false;
let dropTimer = null;

onMounted(() => {
  emitter.on("play", playGame);
  emitter.on("reset", resetGame);
  emitter.on("volume", toggleVolume);
  emitter.on("drop", dropPiece);
  emitter.on("left", movePieceLeft);
  emitter.on("right", movePieceRight);
  emitter.on("down", (enable) => movePieceDown(enable));
  emitter.on("rotate", rotatePiece);

  if (checkGameMode("2p")) {
    isPreview.value = false; // 2p mode is always not preview

    // refresh to join the room
    socket.emit("joinRoom", {
      room: localStorage.getItem("room"),
      action: "refresh",
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

    socket.on("oneGameOver", () => {
      if (!gameOver.value) notify("warning", "2P GAME OVER!!");
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
      resetGame();
      playGame();
    });

    socket.on("oneLeaveRoom", () => {
      notify("warning", "2P Leave The Room");
    });
  }
});

// handle when player leave the game page
onBeforeRouteLeave(() => {
  if (checkGameMode("2p")) {
    socket.emit("leaveRoom", localStorage.getItem("room"));
    return;
  }

  resetGame();
});

function playGame() {
  gamePlay.value = !gamePlay.value;

  if (!dropTimer) addShape();
  if (gamePlay.value) setDropTimer();
  if (!gamePlay.value && dropTimer) clearInterval(dropTimer);
}

function resetGame() {
  if (!dropTimer) return;

  if (dropTimer) {
    clearInterval(dropTimer);
    dropTimer = null;
  }
  game.$patch({
    map: new Array(20).fill(0).map(() => new Array(10).fill(0)),
    currentShape: null,
    previewShape: null,
    nextShape: createShape(),
  });

  gamePlay.value = false;
  gameOver.value = false;

  scoreDiff.value = 0;
  win.value = false;
  lose.value = false;

  filledRows.length = 0;
}

function addShape() {
  currentShape.value = nextShape.value;
  previewShape.value = { ...currentShape.value };
  nextShape.value = createShape();

  // game over
  const { x, y, type, pieces, rotation } = currentShape.value;
  const piece = pieces[rotation];

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + y + (type === 1 ? 1 : 2);

    if (game.map[tmp_y][tmp_x]) {
      clearInterval(dropTimer);

      gameOver.value = true;
      gamePlay.value = false;

      game.$patch({
        currentShape: null,
        previewShape: null,
        nextShape: null,
      });

      if (checkGameMode("2p")) {
        socketEmit("gameOver", "gameOver", true);
        return;
      }

      updateHighScore();

      return;
    }
  }
}

function setDropTimer() {
  if (gameOver.value) return;

  let timestep = Math.round(10 + 800 * Math.pow(0.92, level.value - 1));

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
    fallShape();
  }, timestep);
}

function fallShape() {
  if (movePiece(0, 1)) return;
  landShape();
}

function landShape() {
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
  if (!gamePlay.value) return;

  drop = true;

  setDropTimer();
}

// FIXME: shape can not be added when shape landed
function movePieceDown(enable) {
  if (!gamePlay.value) return;

  clearInterval(dropTimer);

  if (enable && !movePiece(0, 1)) return;

  down = enable;
  setDropTimer();
}

function movePieceLeft() {
  if (!gamePlay.value) return;
  movePiece(-1, 0);
}

function movePieceRight() {
  if (!gamePlay.value) return;
  movePiece(1, 0);
}

// HACK: rotate shape against the wall
function rotatePiece() {
  if (!gamePlay.value) return;

  const { x, y, pieces, rotation } = currentShape.value;
  const currentRotation = rotation;
  const resultRotation = (rotation + 1) % pieces.length;

  currentShape.value.rotation = resultRotation;
  previewShape.value.rotation = resultRotation;

  const piece = currentShape.value.pieces[currentShape.value.rotation];

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + y;

    if (
      tmp_y >= 0 &&
      (game.map[tmp_y] === undefined ||
        game.map[tmp_y][tmp_x] === undefined ||
        game.map[tmp_y][tmp_x] > 0)
    ) {
      currentShape.value.rotation = currentRotation;
      previewShape.value.rotation = currentRotation;
    }
  }
}

function movePiece(xStep, yStep) {
  const { x, y, pieces, rotation } = currentShape.value;
  const piece = pieces[rotation];
  const map = game.map;
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
    currentShape.value.x += xStep;
    currentShape.value.y += yStep;
    previewShape.value.x += xStep;
  }

  return canMove;
}

function mergePiece() {
  const { x, y, type, pieces, rotation } = currentShape.value;
  const piece = pieces[rotation];

  for (let i = 0; i < piece.length; i++) {
    const tmp_x = piece[i][1] + x;
    const tmp_y = piece[i][0] + y;

    if (tmp_y >= 0) game.map[tmp_y][tmp_x] = type + 1;
  }
}

function clearFilledRows() {
  for (let i = 0; i < filledRows.length; i++) {
    game.map.splice(filledRows[i], 1);
    game.map.unshift(new Array(10).fill(0));
  }
}

// HACK: limit the number of score
function updateScore() {
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

// HACK: the value of next level score
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
</script>

<template>
  <Header>
    <Menu :playStatus="gamePlay" @play="playGame" v-if="checkGameMode('1p')" />
  </Header>

  <main class="flex justify-between items-center w-full">
    <MapCanvas />
    <GameBaseInfo :gameMode="gameMode" />
  </main>

  <hr class="w-full border-t-4 border-dashed border-black" />

  <div class="flex w-full">
    <!-- arrow button -->
    <div class="flex flex-col justify-center items-center w-1/2">
      <!-- drop button -->
      <ArrowButton type="drop" @click.prevent="dropPiece" />

      <!-- left and right button -->
      <div class="flex justify-between items-center w-full">
        <ArrowButton type="left" @click.prevent="movePieceLeft" />
        <ArrowButton type="right" @click.prevent="movePieceRight" />
      </div>

      <!-- down button -->
      <ArrowButton
        type="down"
        @touchstart.prevent="movePieceDown(true)"
        @touchend.prevent="movePieceDown(false)"
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
          @click.prevent="resetGame"
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
      <ArrowButton type="rotate" @click.prevent="rotatePiece" />
    </div>
  </div>

  <GamePrepareInfo :gameMode="gameMode" @ready="playGame" />

  <GameOverInfo
    :gameOver="gameOver"
    :title="gameOverTitle"
    :gameMode="gameMode"
    :score="score"
    :highScore="highScore"
    :scoreDiff="scoreDiff"
    :win="win"
    :lose="lose"
  />
</template>
