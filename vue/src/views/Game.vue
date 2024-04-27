<script setup>
import { onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useGameStore } from "@/stores/game.js";
import { socket } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";
import { emitter } from "@/assets/js/emitter.js";
import { checkGameMode } from "@/assets/js/utils.js";

import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import GameCanvas from "@/components/canvas/GameCanvas.vue";
import GameBaseInfo from "@/components/info/GameBaseInfo.vue";
import GameOverInfo from "@/components/info/GameOverInfo.vue";
import GamePrepareInfo from "@/components/info/GamePrepareInfo.vue";
import ButtonOperation from "@/components/operation/ButtonOperation.vue";

const game = useGameStore();

onMounted(() => {
  if (checkGameMode("2p")) {
    game.isPreview = false; // 2p mode is always not preview

    // refresh to join the room
    socket.emit("joinRoom", {
      room: localStorage.getItem("room"),
      action: "refresh",
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
});
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

  <GamePrepareInfo />
  <GameOverInfo />

  <ButtonOperation />
</template>
