<script setup>
import { useRouter } from "vue-router";
import Button from "./Button.vue";

const router = useRouter();

// TODO: not home page or not?
function quitGame() {
  return;

  router.push({
    path: "/",
  });
}
</script>

<template>
  <Button
    type="warning"
    text="QUIT"
    @click.prevent="quitGame"
    @touchstart.prevent="quitGame"
  ></Button>
</template>
