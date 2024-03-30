<script setup>
import { ref } from "vue";
import { useGameStore} from "@/stores/game.js";
import { useRouter } from "vue-router";
import { socket } from "@/assets/js/socket.js";

import Header from "@/components/Header.vue";
import ServerInfo from "@/components/ServerInfo.vue";
import LinkBox from "@/components/LinkBox.vue";
import JoinRoom from "@/components/JoinRoom.vue";

const game = useGameStore();
const router = useRouter();

const showJoinRoom = ref(false);
const serverStatus = ref(true);

socket.on("roomCreated", (data) => {
  game.room = data[socket.id].room

  router.push({
    path: "/game/2p",
  });
});

socket.on("roomJoined", (data) => {
  console.log('room joined');
  router.push({
    path: "/game/2p",
  });
})

socket.on("roomFull", () => {
  console.log('room full');
})

socket.on("roomNotFound", () => {
  console.log('room not found');
})

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
    <div class="flex justify-center items-center gap-2">
      <h1 class="text-3xl">Server</h1>
      <ServerInfo :status="serverStatus" />
    </div>
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
  <JoinRoom v-model="showJoinRoom" />
</template>
