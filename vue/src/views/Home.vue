<template>
  <div class="flex flex-col justify-center items-center gap-8 h-full">
    <h1 class="mb-16 text-5xl">TETRIS</h1>
    <router-link class="flex justify-between items-center gap-3 w-2/3" to="/game">
      <span class="icon-[pixelarticons--user]"></span>
      <span class="flex-1">1 PLAYER</span>
    </router-link>
    <router-link class="flex justify-between items-center gap-3 w-2/3" to="/game">
      <span class="icon-[pixelarticons--users]"></span>
      <span class="flex-1">2 PLAYERS</span>
    </router-link>
  </div>
</template>
