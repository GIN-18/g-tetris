<script setup>
import { useRouter } from "vue-router";

import Button from "./Button.vue";

const router = useRouter();

function quitGame() {
  router.push({
    path: "/",
  });
}
</script>

<template>
  <Button type="warning" text="QUIT" @click.prevent="quitGame"></Button>
</template>
