<script setup>
import { ref, computed } from "vue";
import { useGameStore } from "@/stores/game";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/info/LabelBox.vue";
import Button from "@/components/button/Button.vue";
import ToggleButton from "@/components/button/ToggleButton.vue";
import QuitButton from "@/components/button/QuitButton.vue";

const game = useGameStore();
const isAgain = ref(false);
const again = ref(0);
const title = ref("GAME OVER");
const win = ref(false);
const lose = ref(false);

const buttonType = computed(() => (isAgain.value ? "error" : "success"));
</script>

<template>
  <DialogsBox :title="title" :is-show="game.gameOver">
    <!-- icon for win and lose -->
    <!-- <i class="nes-icon is-large trophy" v-if="win"></i> -->
    <!-- <i class="nes-icon is-large like" v-if="lose"></i> -->

    <!-- info -->
    <div class="flex flex-col gap-4 w-72">
      <!-- your score -->
      <LabelBox label="Your Score:">
        <p>{{ game.score }}</p>
      </LabelBox>

      <!-- high score -->
      <LabelBox label="High Score:">
        <p>{{ game.highScore }}</p>
      </LabelBox>
    </div>

    <!-- button -->
    <div class="flex gap-12">
      <!-- again button -->
      <Button
        type="success"
        text="AGAIN"
        @click.prevent="emitter.emit('reset')"
        @touchstart.prevent="emitter.emit('reset')"
      />

      <!-- quit button -->
      <QuitButton />
    </div>
  </DialogsBox>
</template>

<style scoped>
p {
  @apply mb-0;
}
</style>
