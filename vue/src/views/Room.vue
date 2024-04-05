<script setup>
import { ref, computed } from "vue";
import { useGameStore } from "@/stores/game.js";
import { useRouter } from "vue-router";
import { debounce } from "lodash";
import { socket } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";

import Header from "@/components/Header.vue";
import ServerInfo from "@/components/ServerInfo.vue";
import LinkBox from "@/components/LinkBox.vue";
import JoinRoom from "@/components/JoinRoom.vue";
import Notification from "@/components/Notification.vue";

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
  notify("warning", "Room not found");
});

function createRoom() {
  socket.emit("createRoom");
}

function showRoomBox() {
  showJoinRoom.value = !showJoinRoom.value;
}

const joinRoom = debounce(
  (roomId) => {
    if (!roomId) {
      notify("warning", "Please enter room ID");
      return;
    }
    socket.emit("joinRoom", {
      action: 0,
      room: roomId,
      ready: 0,
      score: 0,
    });
  },
  2000,
  {
    leading: true,
    trailing: false,
  },
);
</script>

<template>
  <Header></Header>
  <div class="flex flex-col justify-center items-center gap-24 h-full">
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
        @click.prevent="showRoomBox"
      />
    </div>
  </div>
  <JoinRoom v-model="showJoinRoom" @join="joinRoom" @cancel="showRoomBox" />
  <Notification />
</template>
