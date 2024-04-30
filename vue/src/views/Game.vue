<script setup>
import { onMounted, provide } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { socket } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";
import { emitter } from "@/assets/js/emitter.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import GameCanvas from "@/components/canvas/GameCanvas.vue";
import GameBaseInfo from "@/components/info/GameBaseInfo.vue";
import GameOverInfo from "@/components/info/GameOverInfo.vue";
import GamePrepareInfo from "@/components/info/GamePrepareInfo.vue";
import ButtonOperation from "@/components/operation/ButtonOperation.vue";

const route = useRoute();
const gameMode = route.params.mode;
provide("gameMode", {
  mode: gameMode,
  checkGameMode,
});

onMounted(() => {
  if (checkGameMode("2p")) {
    // refresh to join the room
    socket.emit("joinRoom", {
      room: localStorage.getItem("room"),
      action: "refresh",
    });

    socket.on("replay", () => {
      emitter.emit("reset");
      emitter.emit("play");
    });

    // TODO: have to handle on leave room
    socket.on("oneLeaveRoom", () => {
      emitter.emit("reset");
      emitter.emit("resetPrepared");
      notify("warning", "2P Leave The Room");
    });
  }
});

onBeforeRouteLeave(() => {
  emitter.emit("reset");

  if (checkGameMode("2p")) {
    socket.emit("leaveRoom", localStorage.getItem("room"));
    socket.off("oneLeaveRoom");
  }
});

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
