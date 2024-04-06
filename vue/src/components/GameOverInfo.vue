<script setup>
import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue";
import Button from "@/components/button/Button.vue";

const props = defineProps({
  title: String,
  gameOver: Boolean,
  gameMode: String,
  score: Number,
  highScore: String,
  scoreDiff: Number,
  again: Number,
});

const emit = defineEmits(["replay", "quit"]);

function checkGameMode(mode) {
  return props.gameMode === mode;
}
</script>

<template>
  <DialogsBox :title="title" :isShow="props.gameOver">
    <div class="flex flex-col gap-4 w-80">
      <LabelBox label="Your Score:">
        <span>{{ props.score }}</span>
      </LabelBox>
      <LabelBox label="High Score:" v-if="checkGameMode('1p')">
        <span>{{ props.highScore }}</span>
      </LabelBox>
      <LabelBox label="2P's Score:" v-if="checkGameMode('2p')">
        <span>{{ props.score - props.scoreDiff }}</span>
      </LabelBox>
      <LabelBox label="Again:" v-if="checkGameMode('2p')">
        <span>{{ props.again }} / 2</span>
      </LabelBox>
    </div>
    <div class="flex gap-12">
      <Button type="success" text="AGAIN" @click.prevent="emit('replay')" />
      <Button type="warning" text="QUIT" @click.prevent="emit('quit')" />
    </div>
  </DialogsBox>
</template>
