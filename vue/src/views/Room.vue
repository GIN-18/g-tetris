<script setup>
import { ref, computed } from "vue";
import { useGameStore } from "@/stores/game.js";
import { useRouter } from "vue-router";
import { socket } from "@/assets/js/socket.js";

import Header from "@/components/Header.vue";
import ServerInfo from "@/components/ServerInfo.vue";
import LinkBox from "@/components/LinkBox.vue";
import JoinRoom from "@/components/JoinRoom.vue";

const game = useGameStore();
const router = useRouter();

const showJoinRoom = ref(false);

socket.on("roomCreated", (data) => {
  localStorage.setItem("room", data[socket.id].room);
  // game.room = data[socket.id].room;

  router.push({
    path: "/game/2p",
  });
});

socket.on("roomJoined", (data) => {
  console.log("room joined"); // TODO: show message here

  localStorage.setItem("room", data[socket.id].room);
  // game.room = data[socket.id].room;

  router.push({
    path: "/game/2p",
  });
});

socket.on("roomFull", () => {
  console.log("room full");
});

socket.on("roomNotFound", () => {
  console.log("room not found");
});

function createRoom() {
  socket.emit("createRoom");
}

function joinRoom() {
  showJoinRoom.value = true;
}
</script>

<template>
  <Header></Header>
  <div class="flex flex-col justify-center items-center gap-24 h-full">
    <!-- <div class="flex justify-center items-center gap-4"> -->
    <!--   <h2 class="mb-0 text-4xl">SERVER</h2> -->
    <!--   <ServerInfo :status="serverStatus" /> -->
    <!-- </div> -->
    <div class="flex flex-col gap-10">
      <LinkBox
        link="#"
        icon="icon-[pixelarticons--building-community]"
        text="Create Room"
        @click.prevent="createRoom"
      />
      <LinkBox
        link="#"
        icon="icon-[pixelarticons--user-plus]"
        text="Join Room"
        @click.prevent="joinRoom"
      />
    </div>
  </div>
  <JoinRoom v-if="showJoinRoom" v-model="showJoinRoom" />
</template>
