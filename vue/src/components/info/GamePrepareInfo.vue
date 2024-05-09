<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from "vue";
import { useGameStore } from "@/stores/game.js";
import { socketEmit } from "@/assets/js/socket.js";
import { emitter } from "@/assets/js/emitter.js";

import DialogsBox from "@/components/DialogsBox.vue";
import RoomID from "@/components/RoomID.vue";
import LabelBox from "@/components/info/LabelBox.vue";
import ToggleButton from "@/components/button/ToggleButton.vue";
import QuitButton from "@/components/button/QuitButton.vue";

const game = useGameStore();
const gameMode = inject("gameMode");
const isReady = ref(false);
const prepared = ref(0);
const showPrepare = ref(false);

const info = computed(() => getStatusInfo(isReady.value));

onMounted(() => {
  if (gameMode.checkGameMode("2p")) {
    showPrepare.value = true;

    emitter.on("ready", toggleAgain);
    emitter.on("resetPrepared", resetPrepared);
    emitter.on("zeroReady", zeroReady);
    emitter.on("oneReady", oneReady);
    emitter.on("twoReady", twoReady);
  }
});

onUnmounted(() => {
  if (gameMode.checkGameMode("2p")) {
    emitter.off("ready", toggleAgain);
    emitter.off("resetPrepared", resetPrepared);
    emitter.off("zeroReady", zeroReady);
    emitter.off("oneReady", oneReady);
    emitter.off("twoReady", twoReady);
  }
});

function getStatusInfo(value) {
  return {
    buttonType: value ? "error" : "success",
    statusText: value ? "Ready" : "Not Ready",
    statusClass: {
      "text-nes-deep-red": !value,
      "text-nes-deep-green": value,
    },
  };
}

function toggleAgain() {
  isReady.value = !isReady.value;
  socketEmit("ready", "ready", isReady.value);
}

function zeroReady() {
  prepared.value = 0;
}

function oneReady() {
  prepared.value = 1;
}

function twoReady() {
  prepared.value = 2;
  showPrepare.value = false;
  emitter.emit("play");
}

function resetPrepared() {
  isReady.value = false;
  prepared.value = 0;
  showPrepare.value = true;
  socketEmit("ready", "ready", isReady.value);
}
</script>

<template>
  <DialogsBox title="PREPARE" :is-show="showPrepare">
    <div class="flex flex-col gap-4 w-72">
      <RoomID />

      <!-- prepare status -->
      <LabelBox label="Status:">
        <p :class="info.statusClass">{{ info.statusText }}</p>
      </LabelBox>

      <!-- number of prepared -->
      <LabelBox label="Prepared:">
        <p>{{ prepared }} / {{ game.players }}</p>
      </LabelBox>
    </div>

    <div class="flex gap-12">
      <!-- ready or cancel button -->
      <ToggleButton
        :type="info.buttonType"
        :status="isReady"
        event="ready"
        trueText="Cancel"
        falseText="Ready"
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
