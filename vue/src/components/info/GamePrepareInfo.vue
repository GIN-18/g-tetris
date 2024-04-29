<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { socket, socketEmit } from "@/assets/js/socket.js";
import { emitter } from "@/assets/js/emitter.js";

import DialogsBox from "@/components/DialogsBox.vue";
import RoomID from "@/components/RoomID.vue";
import LabelBox from "@/components/info/LabelBox.vue";
import ToggleButton from "@/components/button/ToggleButton.vue";
import QuitButton from "@/components/button/QuitButton.vue";

const route = useRoute();
const gameMode = route.params.mode;
const isReady = ref(false);
const prepared = ref(0);
const showPrepare = ref(false);

const info = computed(() => getStatusInfo(isReady.value));

onMounted(() => {
  if (checkGameMode("2p")) {
    showPrepare.value = true;
    socketEmit("ready", "ready", false);

    // toggle ready
    emitter.on("ready", toggleAgain);

    // reset prepared
    emitter.on("resetPrepared", resetPrepared);

    socket.on("zeroReady", () => {
      prepared.value = 0;
    });

    socket.on("oneReady", () => {
      prepared.value = 1;
    });

    socket.on("twoReady", () => {
      prepared.value = 2;
      showPrepare.value = false;
      emitter.emit("play");
    });
  }
});

onUnmounted(() => {
  if (checkGameMode("2p")) {
    emitter.off("ready", toggleAgain);

    socket.off("zeroReady");
    socket.off("oneReady");
    socket.off("twoReady");
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

function resetPrepared() {
  isReady.value = false;
  prepared.value = 0;
  showPrepare.value = true;
  socketEmit("ready", "ready", isReady.value);
}

function checkGameMode(mode) {
  return gameMode === mode;
}
</script>

<template>
  <DialogsBox title="PREPARE" :isShow="showPrepare">
    <div class="flex flex-col gap-4 w-72">
      <RoomID />

      <!-- prepare status -->
      <LabelBox label="Status:">
        <p :class="info.statusClass">{{ info.statusText }}</p>
      </LabelBox>

      <!-- number of prepared -->
      <LabelBox label="Prepared:">
        <p>{{ prepared }} / 2</p>
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
