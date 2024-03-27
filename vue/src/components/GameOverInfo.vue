<script setup>
import { useRouter } from "vue-router";

import Button from "@/components/Button.vue";

const router = useRouter()

const props = defineProps({
  score: {
    type: Number,
  },
  highScore: {
    type: String,
  },
  gameOver: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["replay"]);

function replayGame() {
  emit("replay");
}

function quitGame() {
  emit("replay");
  router.push({
    path: "/",
  })
}
</script>

<template>
  <div
    class="z-10 flex justify-center items-center absolute top-0 left-0 w-full h-full"
    v-if="gameOver"
  >
    <div class="flex flex-col justify-between items-center w-full h-1/2">
      <h2 class="text-3xl">GAME OVER</h2>
      <div class="flex flex-col gap-4 text-sm">
        <div class="flex justify-between w-full">
          <span class="font-semibold">Your Score:</span>
          <span>{{ props.score }}</span>
        </div>
        <div class="flex justify-between w-full">
          <span class="font-semibold">High Score:</span>
          <span>{{ props.highScore }}</span>
        </div>
      </div>
      <div class="flex gap-12">
        <Button description="again" text="AGAIN" @click.prevent="replayGame" />
        <Button description="quit" text="QUIT" @click.prevent="quitGame" />
      </div>
    </div>
  </div>
</template>
