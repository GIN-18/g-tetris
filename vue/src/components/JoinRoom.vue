<script setup>
import { ref } from "vue";
import { socket } from "@/assets/js/socket.js";
import { notify } from "@/assets/js/notify.js";

import Button from "@/components/button/Button.vue";
import DialogsBox from "@/components/DialogsBox.vue";

const model = defineModel();
const emit = defineEmits(["cancel"]);

const roomId = ref("");

socket.on("roomFull", () => {
  notify("warning", "Room is full.");
});

socket.on("roomNotFound", () => {
  notify("error", "Room not found!");
});

function joinRoom() {
  if (!roomId.value) {
    notify("warning", "Please enter room ID.");
    return;
  }

  socket.emit("joinRoom", {
    room: roomId,
    action: "join",
  });
}
</script>

<template>
  <DialogsBox title="JOIN ROOM" :isShow="model">
    <div class="flex flex-col justify-center items-center gap-12 w-72">
      <input
        type="text"
        placeholder="Room ID"
        class="nes-input bg-nes-gray outline-none"
        v-model="roomId"
      />
      <div class="flex gap-12">
        <Button type="success" text="JOIN" @click.prevent="joinRoom" />
        <Button type="warning" text="CANCEL" @click.prevent="emit('cancel')" />
      </div>
    </div>
  </DialogsBox>
</template>
