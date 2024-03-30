<script setup>
import { ref } from "vue";
import { debounce } from "lodash";

import { socket } from "@/assets/js/socket.js";

import Button from "@/components/Button.vue";
import Dialogs from "@/components/Dialogs.vue";

const model = defineModel();

const roomId = ref("");

const joinRoom = debounce(
  () => {
    if (!roomId.value) {
      console.log("room id is empty"); // show message here
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
  }
);

function cancelJoinRoom() {
  model.value = false;
}
</script>

<template>
  <Dialogs :show="model">
    <h2 class="text-3xl">Join Room</h2>
    <div class="flex flex-col justify-center items-center gap-12">
      <input
        type="text"
        placeholder="Room ID"
        class="nes-input bg-nes-gray outline-none"
        v-model="roomId"
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
  </Dialogs>
</template>
