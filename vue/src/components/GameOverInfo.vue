<script setup>
import { useRouter } from "vue-router";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue";
import Button from "@/components/Button.vue";

const router = useRouter();

const props = defineProps({
  gameMode: String,
  score: Number,
  highScore: String,
  scoreDiff: Number,
});

const emit = defineEmits(["replay"]);

function replayGame() {
  emit("replay");
}

function quitGame() {
  router.push({
    path: "/",
  });
}
</script>

<template>
  <DialogsBox title="GAME OVER">
    <div class="flex flex-col gap-4 w-64 text-sm">
      <LabelBox label="Your Score:">
        <span>{{ props.score }}</span>
      </LabelBox>
      <LabelBox label="High Score:" v-if="gameMode === '1p'">
        <span>{{ props.highScore }}</span>
      </LabelBox>
      <LabelBox label="2P's Score:" v-if="gameMode === '2p'">
        <span>{{ props.score - props.scoreDiff }}</span>
      </LabelBox>
    </div>
    <div class="flex gap-12">
      <Button description="success" text="AGAIN" @click.prevent="replayGame" />
      <Button description="warning" text="QUIT" @click.prevent="quitGame" />
    </div>
  </DialogsBox>
</template>
