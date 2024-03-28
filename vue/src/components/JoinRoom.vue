<script setup>
import { useMessageStore } from "@/stores/message.js";

import { socket } from "@/assets/js/socket.js";

import Button from "@/components/Button.vue";

const message = useMessageStore();

const model = defineModel()

function cancelJoinRoom() {
  model.value = !model.value;
}

function joinRoom() {
  message.messageType = "warning";
  message.messageText = "Joining room...";
  message.showMessage = !message.showMessage;
}
</script>

<template>
  <div
    class="z-10 fixed top-0 right-0 flex flex-col justify-center items-center gap-16 w-full h-full p-8 bg-nes-gray"
    v-if="model"
  >
    <h2 class="text-2xl">Join Room</h2>
    <div class="flex flex-col justify-center items-center gap-12">
      <input
        type="text"
        placeholder="Room ID"
        class="nes-input bg-nes-gray outline-none"
      />
      <div class="flex gap-12">
        <Button description="join" text="Join" @click.prevent="joinRoom" />
        <Button
          description="cancel"
          text="Cancel"
          @click.prevent="cancelJoinRoom"
        />
      </div>
    </div>
  </div>
</template>
