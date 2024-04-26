<script setup>
import { ref, computed, onMounted } from "vue";
import { socket, socketEmit } from "@/assets/js/socket.js";

import DialogsBox from "@/components/DialogsBox.vue";
import RoomID from "@/components/RoomID.vue";
import LabelBox from "@/components/info/LabelBox.vue";
import EmitEventButton from "@/components/button/EmitEventButton.vue";
import QuitButton from "@/components/button/QuitButton.vue";

const isReady = ref(false);
const prepared = ref(0);
const showPrepare = ref(false);

const emit = defineEmits(["ready"]);
const props = defineProps({
  gameMode: String,
});

const statusClass = computed(() => ({
  "text-nes-deep-red": !isReady.value,
  "text-nes-deep-green": isReady.value,
}));
const statusText = computed(() => (isReady.value ? "Ready" : "Not Ready"));

onMounted(() => {
  if (props.gameMode === "2p") {
    showPrepare.value = true;
    socketEmit("ready", "ready", false);
  }

  socket.on("zeroReady", () => {
    prepared.value = 0;
  });

  socket.on("oneReady", () => {
    prepared.value = 1;
  });

  socket.on("twoReady", () => {
    prepared.value = 2;
    showPrepare.value = false;
    emit("ready");
  });
});
</script>

<template>
  <DialogsBox title="PREPARE" :isShow="showPrepare">
    <div class="flex flex-col gap-4 w-72">
      <RoomID />

      <!-- prepare status -->
      <LabelBox label="Status:">
        <span :class="statusClass">{{ statusText }}</span>
      </LabelBox>

      <!-- number of prepared -->
      <LabelBox label="Prepared:">
        <span class="">{{ prepared }} / 2</span>
      </LabelBox>
    </div>

    <div class="flex gap-12">
      <!-- ready or cancel button -->
      <EmitEventButton event="ready" v-model:attr="isReady" />

      <!-- quit button -->
      <QuitButton />
    </div>
  </DialogsBox>
</template>
