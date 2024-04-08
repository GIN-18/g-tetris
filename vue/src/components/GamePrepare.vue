<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { socket } from "@/assets/js/socket.js";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue";
import Button from "@/components/button/Button.vue";
import EmitEventButton from "@/components/button/EmitEventButton.vue";

const room = localStorage.getItem("room");
const isReady = ref(false);
const prepared = ref(0);
const showPrepare = ref(false);

const emit = defineEmits(["ready", "quit"]);
const props = defineProps({
  gameMode: String,
});

const statusClass = computed(() => ({
  "text-nes-deep-red": !isReady.value,
  "text-nes-deep-green": isReady.value,
}));
const statusText = computed(() => (isReady.value ? "Ready" : "Not Ready"));

onMounted(() => {
  if (props.gameMode === "2p") showPrepare.value = true;

  socket.on("onePlayerReady", () => {
    prepared.value = 1;
  });

  socket.on("twoPlayerReady", () => {
    prepared.value = 2;
    showPrepare.value = false;
    emit("ready");
  });
});
</script>

<template>
  <DialogsBox title="PREPARE" :isShow="showPrepare">
    <div class="flex flex-col gap-4 w-72">
      <!-- room id -->
      <LabelBox label="Room ID:">
        <span>{{ room }}</span>
      </LabelBox>

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
      <EmitEventButton
        event="ready"
        v-model:attr="isReady"
        v-model:sum="prepared"
      />

      <!-- quit button -->
      <Button type="warning" text="QUIT" @click.prevent="emit('quit')" />
    </div>
  </DialogsBox>
</template>
