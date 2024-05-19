<script setup>
import { provide, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/stores/game.js";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { socket, socketEmit } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";
import { emitter } from "@/assets/js/emitter.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import GameCanvas from "@/components/canvas/GameCanvas.vue";
import GameBaseInfo from "@/components/info/GameBaseInfo.vue";
import GameOverInfo from "@/components/info/GameOverInfo.vue";
import GamePrepareInfo from "@/components/info/GamePrepareInfo.vue";
import ButtonOperation from "@/components/operation/ButtonOperation.vue";

const game = useGameStore();
const router = useRouter();
const route = useRoute();
const gameMode = route.params.mode;
provide("gameMode", {
  mode: gameMode,
  checkGameMode,
});

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("load", handleLoad);

  if (checkGameMode("2p")) {
    // init ready status when entering game page
    socketEmit("ready", "ready", false);

    socket.on("roomJoined", () => {
      notify("success", "2P has joined the room.");
    });

    socket.on("zeroReady", () => {
      emitter.emit("zeroReady");
    });

    socket.on("oneReady", () => {
      emitter.emit("oneReady");
    });

    socket.on("twoReady", () => {
      emitter.emit("twoReady");
    });

    socket.on("scoreUpdated", (data) => {
      emitter.emit("scoreUpdated", data);
    });

    socket.on("oneGameOver", () => {
      emitter.emit("oneGameOver");
    });

    socket.on("twoGameOver", () => {
      emitter.emit("twoGameOver");
    });

    socket.on("zeroAgain", () => {
      emitter.emit("zeroAgain");
    });

    socket.on("oneAgain", () => {
      emitter.emit("oneAgain");
    });

    socket.on("twoAgain", () => {
      emitter.emit("twoAgain");
    });

    socket.on("replay", () => {
      emitter.emit("reset");
      emitter.emit("play");
    });

    socket.on("oneLeaveRoom", (data) => {
      emitter.emit("reset");
      emitter.emit("resetPrepared");
      game.players = Object.keys(data).length;
      notify("warning", "2P has left the room.");
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  window.removeEventListener("load", handleLoad);

  if (checkGameMode("2p")) {
    socket.off("roomJoined");
    socket.off("zeroReady");
    socket.off("oneReady");
    socket.off("twoReady");
    socket.off("scoreUpdated");
    socket.off("oneGameOver");
    socket.off("twoGameOver");
    socket.off("zeroAgain");
    socket.off("oneAgain");
    socket.off("twoAgain");
    socket.off("replay");
    socket.off("oneLeaveRoom");
  }
});

onBeforeRouteLeave(() => {
  emitter.emit("reset");

  if (checkGameMode("2p")) {
    socket.emit("leaveRoom", sessionStorage.getItem("room"));
  }
});

function handleBeforeUnload(e) {
  e.preventDefault();
  return "Are you sure you want to leave?";
}

function handleLoad() {
  router.push({
    path: "/",
  });
}

function checkGameMode(mode) {
  return gameMode === mode;
}
</script>

<template>
  <Header>
    <Menu />
  </Header>

  <main class="flex justify-between items-center w-full">
    <GameCanvas />
    <GameBaseInfo />
  </main>

  <hr class="w-full border-t-4 border-dashed border-black" />

  <ButtonOperation />

  <GamePrepareInfo />
  <GameOverInfo />
</template>
