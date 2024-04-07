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
  <h1 class="text-3xl" @click.prevent="jumpToHome">TETRIS</h1>
</template>
