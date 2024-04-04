<script setup>
import { useRouter } from "vue-router";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue";
import Button from "@/components/button/Button.vue";

const router = useRouter();

const props = defineProps({
  title: String,
  gameMode: String,
  gameOver: Boolean,
  score: Number,
  highScore: String,
  scoreDiff: Number,
});

const emit = defineEmits(["replay", "again"]);

function replayGame() {
  if (checkGameMode("2p")) {
    emit("again");
    return;
  }

  emit("replay");
}

function quitGame() {
  router.push({
    path: "/",
  });
}

function checkGameMode(mode) {
  return props.gameMode === mode;
}
</script>

<template>
  <DialogsBox :title="title" :isShow="props.gameOver">
    <div class="flex flex-col gap-4 w-64 text-sm">
      <LabelBox label="Your Score:">
        <span>{{ props.score }}</span>
      </LabelBox>
      <LabelBox label="High Score:" v-if="checkGameMode('1p')">
        <span>{{ props.highScore }}</span>
      </LabelBox>
      <LabelBox label="2P's Score:" v-if="checkGameMode('2p')">
        <span>{{ props.score - props.scoreDiff }}</span>
      </LabelBox>
    </div>
    <div class="flex gap-12">
      <Button type="success" text="AGAIN" @click.prevent="replayGame" />
      <Button type="warning" text="QUIT" @click.prevent="quitGame" />
    </div>
  </DialogsBox>
</template>
