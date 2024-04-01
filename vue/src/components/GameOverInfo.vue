<script setup>
import { useRouter } from "vue-router";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue"
import Button from "@/components/Button.vue";

const router = useRouter();

const props = defineProps({
  score: {
    type: Number,
  },
  highScore: {
    type: String,
  },
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
    <div class="flex flex-col gap-4 text-sm">
      <LabelBox label="Your Score:">
        <span>{{ props.score }}</span>
      </LabelBox>
      <LabelBox label="High Score:">
        <span>{{ props.highScore }}</span>
      </LabelBox>
    </div>
    <div class="flex gap-12">
      <Button description="success" text="AGAIN" @click.prevent="replayGame" />
      <Button description="warning" text="QUIT" @click.prevent="quitGame" />
    </div>
  </DialogsBox>
</template>
