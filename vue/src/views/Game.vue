<script setup>
import { ref, onMounted } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { useGameStore } from "@/stores/game.js";
import { socket } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";
import { emitter } from "@/assets/js/emitter.js";
import { playConfetti } from "@/assets/js/confetti.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import GameCanvas from "@/components/canvas/GameCanvas.vue";
import GameBaseInfo from "@/components/info/GameBaseInfo.vue";
import ButtonOperation from "@/components/operation/ButtonOperation.vue";
import Button from "@/components/button/Button.vue";
import ArrowButton from "@/components/button/ArrowButton.vue";
import StatusButton from "@/components/button/StatusButton.vue";
import GameOverInfo from "@/components/info/GameOverInfo.vue";
import GamePrepareInfo from "@/components/info/GamePrepareInfo.vue";

const route = useRoute();

const gameMode = route.params.mode;

const gameOverTitle = ref("GAME OVER");

const volumeUp = ref(true);

onMounted(() => {
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
      emitter.emit("reset");
      emitter.emit("play");
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

  emitter.emit("reset");
  emitter.all.clear();
});

function checkGameMode(mode) {
  return gameMode === mode;
}
</script>

<template>
  <Header>
    <Menu v-if="checkGameMode('1p')" />
  </Header>

  <main class="flex justify-between items-center w-full">
    <GameCanvas />
    <GameBaseInfo :gameMode="gameMode" />
  </main>

  <hr class="w-full border-t-4 border-dashed border-black" />

  <ButtonOperation />

  <!-- <GamePrepareInfo :gameMode="gameMode" @ready="playGame" /> -->

  <GameOverInfo :title="gameOverTitle" :gameMode="gameMode" />
</template>
