<script setup>
import LinkBox from "@/components/LinkBox.vue";
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-24 h-full">
    <h1 class="text-5xl">TETRIS</h1>
    <div class="flex flex-col gap-10">
      <LinkBox
        link="/game/1p"
        icon="icon-[pixelarticons--user]"
        text="1 PLAYER"
      />
      <LinkBox
        link="/room"
        icon="icon-[pixelarticons--users]"
        text="2 PLAYER"
      />
    </div>
  </div>
</template>
