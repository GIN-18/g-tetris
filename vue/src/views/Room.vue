<script setup>
import { ref } from "vue";

import LinkBox from "@/components/LinkBox.vue";
import JoinRoom from "@/components/JoinRoom.vue";

const showJoinRoom = ref(false);
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-24 h-full">
    <h1 class="text-5xl">ROOM</h1>
    <div class="flex flex-col gap-10">
      <LinkBox
        link="/game"
        icon="icon-[pixelarticons--building-community]"
        text="Create Room"
      />
      <LinkBox
        link="#"
        icon="icon-[pixelarticons--user-plus]"
        text="Join Room"
        v-model="showJoinRoom"
      />
    </div>
  </div>
  <JoinRoom v-model="showJoinRoom" />
</template>
