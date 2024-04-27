<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useGameStore } from "@/stores/game";
import { socket, socketEmit } from "@/assets/js/socket.js";
import { emitter } from "@/assets/js/emitter.js";
import { playConfetti } from "@/assets/js/confetti.js";
import { checkGameMode } from "@/assets/js/utils.js";

import DialogsBox from "@/components/DialogsBox.vue";
import RoomID from "@/components/RoomID.vue";
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

// reset isAgain and again while replay the game
watch(
  () => game.gameOver,
  () => {
    if (!game.gameOver) {
      isAgain.value = false;
      again.value = 0;
    }
  },
);

onMounted(() => {
  // toggle again
  emitter.on("again", () => {
    isAgain.value = !isAgain.value;
    socketEmit("again", "again", isAgain.value);
  });

  socket.on("scoreUpdated", (data) => {
    const scoreArray = [];

    for (let item in data) {
      if (item === socket.id) {
        scoreArray[0] = data[item].score;
      } else {
        scoreArray[1] = data[item].score;
      }
    }

    game.scoreDiff = scoreArray[0] - scoreArray[1];
  });

  socket.on("oneGameOver", () => {
    if (!game.gameOver) notify("warning", "2P GAME OVER!!");
  });

  socket.on("twoGameOver", () => {
    if (game.scoreDiff > 0) {
      title.value = "VICTORY";
      win.value = true;
      playConfetti(game.palette);
    } else if (game.scoreDiff < 0) {
      title.value = "TRY AGAIN";
      lose.value = true;
    }
  });

  socket.on("zeroAgain", () => {
    again.value = 0;
  });

  socket.on("oneAgain", () => {
    again.value = 1;
  });

  socket.on("twoAgain", () => {
    title.value = "GAME OVER";
    win.value = false;
    lose.value = false;

    again.value = 2;
    socket.emit("replay", {
      room: localStorage.getItem("room"),
    });
  });
});
</script>

<template>
  <DialogsBox :title="title" :isShow="game.gameOver">
    <!-- icon for win and lose -->
    <i class="nes-icon is-large trophy" v-if="win"></i>
    <i class="nes-icon is-large like" v-if="lose"></i>

    <!-- info -->
    <div class="flex flex-col gap-4 w-72">
      <RoomID v-if="checkGameMode('2p')" />

      <!-- your score -->
      <LabelBox label="Your Score:">
        <p>{{ game.score }}</p>
      </LabelBox>

      <!-- high score -->
      <LabelBox label="High Score:" v-if="checkGameMode('1p')">
        <p>{{ game.highScore }}</p>
      </LabelBox>

      <!-- player 2's score -->
      <LabelBox label="2P's Score:" v-if="checkGameMode('2p')">
        <p>{{ game.score - game.scoreDiff }}</p>
      </LabelBox>

      <!-- number of again -->
      <LabelBox label="Again:" v-if="checkGameMode('2p')">
        <p>{{ again }} / 2</p>
      </LabelBox>
    </div>

    <!-- button -->
    <div class="flex gap-12">
      <!-- again button -->
      <Button
        type="success"
        text="AGAIN"
        v-if="checkGameMode('1p')"
        @click.prevent="emitter.emit('reset')"
      />
      <ToggleButton
        :type="buttonType"
        :status="isAgain"
        event="again"
        trueText="CANCEL"
        falseText="AGAIN"
        v-if="checkGameMode('2p')"
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
