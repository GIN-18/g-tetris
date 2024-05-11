<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { socket } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";

import Button from "@/components/button/Button.vue";
import DialogsBox from "@/components/DialogsBox.vue";

const roomId = ref("");
const model = defineModel();
const emit = defineEmits(["cancel"]);

onMounted(() => {
  socket.on("roomFull", () => {
    notify("warning", "Room is full.");
  });

  socket.on("roomNotFound", () => {
    notify("error", "Room not found!");
  });
});

onUnmounted(() => {
  socket.off("roomFull");
  socket.off("roomNotFound");
});

function joinRoom() {
  if (!roomId.value) {
    notify("warning", "Please enter room ID.");
    return;
  }

  socket.emit("joinRoom", {
    room: roomId.value,
    action: "join",
  });
}
</script>

<template>
  <DialogsBox title="JOIN ROOM" :is-show="model">
    <div class="flex flex-col justify-center items-center gap-12 w-72">
      <input
        type="text"
        placeholder="Room ID"
        class="nes-input bg-nes-gray outline-none"
        v-model="roomId"
        @keydown.enter="joinRoom"
      />
      <div class="flex gap-12">
        <Button
          type="success"
          text="JOIN"
          @click.prevent="joinRoom"
          @touchstart.prevent="joinRoom"
        />
        <Button
          type="warning"
          text="CANCEL"
          @click.prevent="emit('cancel')"
          @touchstart.prevent="emit('cancel')"
        />
      </div>
    </div>
  </DialogsBox>
</template>
