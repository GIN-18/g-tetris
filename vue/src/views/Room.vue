<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { socket } from "@/assets/js/socket.js";

import Header from "@/components/Header.vue";
import LinkBox from "@/components/LinkBox.vue";
import JoinRoom from "@/components/JoinRoom.vue";
import Footer from "@/components/Footer.vue";

const router = useRouter();

const showJoinRoom = ref(false);

socket.on("roomCreated", handleRoomEvent);
socket.on("roomJoined", handleRoomEvent);

function createRoom() {
  socket.emit("createRoom");
}

function toggleRoomBox() {
  showJoinRoom.value = !showJoinRoom.value;
}

function handleRoomEvent(data) {
  localStorage.setItem("room", data[socket.id].room);

  router.push({
    path: "/game/2p",
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
        @click.prevent="toggleRoomBox"
      />
    </div>
  </div>

  <!-- join room box -->
  <JoinRoom v-model="showJoinRoom" @cancel="toggleRoomBox" />

  <Footer />
</template>
