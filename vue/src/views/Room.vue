<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { socket } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";

import Header from "@/components/Header.vue";
import ServerInfo from "@/components/ServerInfo.vue";
import LinkBox from "@/components/LinkBox.vue";
import JoinRoom from "@/components/JoinRoom.vue";

const router = useRouter();

const showJoinRoom = ref(false);

socket.on("roomCreated", (data) => {
  localStorage.setItem("room", data[socket.id].room);

  router.push({
    path: "/game/2p",
  });
});

socket.on("roomJoined", (data) => {
  localStorage.setItem("room", data[socket.id].room);

  router.push({
    path: "/game/2p",
  });
});

socket.on("roomFull", () => {
  notify("warning", "Room is full.");
});

socket.on("roomNotFound", () => {
  notify("error", "Room not found!");
});

function createRoom() {
  socket.emit("createRoom");
}

function showRoomBox() {
  showJoinRoom.value = !showJoinRoom.value;
}

function joinRoom(roomId) {
  if (!roomId) {
    notify("warning", "Please enter room ID.");
    return;
  }

  socket.emit("joinRoom", {
    action: 0,
    room: roomId,
    ready: 0,
    score: 0,
  });
}
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
</template>
