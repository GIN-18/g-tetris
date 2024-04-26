<script setup>
import { ref, watch, onMounted } from "vue";
import { useGameStore } from "@/stores/game";
import { socket } from "@/assets/js/socket.js";

import DialogsBox from "@/components/DialogsBox.vue";
import RoomID from "@/components/RoomID.vue";
import LabelBox from "@/components/info/LabelBox.vue";
import EmitEventButton from "@/components/button/EmitEventButton.vue";
import QuitButton from "@/components/button/QuitButton.vue";

const isAgain = ref(false);
const again = ref(0);

const game = useGameStore();
const props = defineProps({
  title: String,
  gameOver: Boolean,
  gameMode: String,
  score: Number,
  highScore: [String, Number],
  scoreDiff: Number,
  win: Boolean,
  lose: Boolean,
});

// reset isAgain and again while replay the game
watch(
  () => props.gameOver,
  () => {
    if (!props.gameOver) {
      isAgain.value = false;
      again.value = 0;
    }
  },
);

onMounted(() => {
  socket.on("zeroAgain", () => {
    again.value = 0;
  });

  socket.on("oneAgain", () => {
    again.value = 1;
  });

  socket.on("twoAgain", () => {
    again.value = 2;
    socket.emit("replay", {
      room: localStorage.getItem("room"),
    });
  });
});

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
      <RoomID v-if="checkGameMode('2p')" />

      <!-- your score -->
      <LabelBox label="Your Score:">
        <span>{{ game.score }}</span>
      </LabelBox>

      <!-- high score -->
      <LabelBox label="High Score:" v-if="checkGameMode('1p')">
        <span>{{ game.highScore }}</span>
      </LabelBox>

      <!-- player 2's score -->
      <LabelBox label="2P's Score:" v-if="checkGameMode('2p')">
        <span>{{ game.score - game.scoreDiff }}</span>
      </LabelBox>

      <!-- number of again -->
      <LabelBox label="Again:" v-if="checkGameMode('2p')">
        <span>{{ again }} / 2</span>
      </LabelBox>
    </div>

    <!-- button -->
    <div class="flex gap-12">
      <!-- again button -->
      <EmitEventButton event="again" v-model:attr="isAgain" />

      <!-- quit button -->
      <QuitButton />
    </div>
  </DialogsBox>
</template>
