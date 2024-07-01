<script setup>
import Header from "@/components/Header.vue";
import Menu from "@/components/menu/Menu.vue";
import PlayfieldCanvas from "@/components/canvas/PlayfieldCanvas.vue";
import LeftSideInfo from "@/components/info/LeftSideInfo.vue";
import RightSideInfo from "@/components/info/RightSideInfo.vue";
import GameOverInfo from "@/components/info/GameOverInfo.vue";
import ButtonOperation from "@/components/operation/ButtonOperation.vue";
import KeyOperation from "@/components/operation/KeyOperation.vue";
</script>

<template>
  <Header>
    <Menu />
  </Header>

  <main class="flex justify-between items-center w-full">
    <LeftSideInfo />
    <PlayfieldCanvas />
    <RightSideInfo />
  </main>

  <ButtonOperation />
  <KeyOperation />

  <GameOverInfo />
</template>
