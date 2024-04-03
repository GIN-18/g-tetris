<script setup>
import { ref } from "vue";
import { debounce } from "lodash";

import { socket } from "@/assets/js/socket.js";

import Button from "@/components/button/Button.vue";
import DialogsBox from "@/components/DialogsBox.vue";

const model = defineModel();

const roomId = ref("");

const joinRoom = debounce(
  () => {
    if (!roomId.value) {
      console.log("room id is empty"); // TODO: show message here
      return;
    }
    socket.emit("joinRoom", {
      action: 0,
      room: roomId.value,
      ready: 0,
      score: 0,
    });
  },
  2000,
  {
    leading: true,
    trailing: false,
  },
);

function cancelJoinRoom() {
  model.value = false;
}
</script>

<template>
  <DialogsBox title="JOIN ROOM">
    <div class="flex flex-col justify-center items-center gap-12">
      <input
        type="text"
        placeholder="Room ID"
        class="nes-input bg-nes-gray outline-none"
        v-model="roomId"
      />
      <div class="flex gap-12">
        <Button description="success" text="Join" @click.prevent="joinRoom" />
        <Button
          description="warning"
          text="Cancel"
          @click.prevent="cancelJoinRoom"
        />
      </div>
    </div>
  </DialogsBox>
</template>
