<script setup>
import { socket } from "@/assets/js/socket.js";

import LinkBox from "@/components/LinkBox.vue";
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-24 h-full">
    <h1 class="text-3xl">ROOM</h1>
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
      />
    </div>
  </div>
</template>
