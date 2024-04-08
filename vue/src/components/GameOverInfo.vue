<script setup>
import { computed } from "vue";

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
  isAgain: Boolean,
  again: Number,
  win: Boolean,
  lose: Boolean,
});

const emit = defineEmits(["replay", "quit"]);

function checkGameMode(mode) {
  return props.gameMode === mode;
}
</script>

<template>
  <DialogsBox :title="title" :isShow="props.gameOver">
    <!-- icon for win and lose -->
    <i class="nes-icon is-large trophy" v-if="props.win"></i>
    <i class="nes-icon is-large like" v-if="props.lose"></i>

    <!-- info -->
    <div class="flex flex-col gap-4 w-72">
      <!-- your score -->
      <LabelBox label="Your Score:">
        <span>{{ props.score }}</span>
      </LabelBox>

      <!-- high score -->
      <LabelBox label="High Score:" v-if="checkGameMode('1p')">
        <span>{{ props.highScore }}</span>
      </LabelBox>

      <!-- player 2's score -->
      <LabelBox label="2P's Score:" v-if="checkGameMode('2p')">
        <span>{{ props.score - props.scoreDiff }}</span>
      </LabelBox>

      <!-- number of again -->
      <LabelBox label="Again:" v-if="checkGameMode('2p')">
        <span>{{ props.again }} / 2</span>
      </LabelBox>
    </div>

    <!-- button -->
    <div class="flex gap-12">
      <!-- again button -->
      <Button type="success" text="AGAIN" @click.prevent="emit('replay')" />

      <!-- quit button -->
      <Button type="warning" text="QUIT" @click.prevent="emit('quit')" />
    </div>
  </DialogsBox>
</template>
