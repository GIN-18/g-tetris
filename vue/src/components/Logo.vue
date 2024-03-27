<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function jumpToHome() {
  router.push({
    path: "/",
  });
}
</script>

<template>
  <h1 class="!m-0 text-3xl !leading-7" @click.prevent="jumpToHome">TETRIS</h1>
</template>
