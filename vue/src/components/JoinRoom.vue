<script setup>
import { ref } from "vue";

import Button from "@/components/button/Button.vue";
import DialogsBox from "@/components/DialogsBox.vue";

const model = defineModel();
const emit = defineEmits(["join", "cancel"]);

const roomId = ref("");
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
        <Button
          type="success"
          text="JOIN"
          @click.prevent="emit('join', roomId)"
        />
        <Button type="warning" text="CANCEL" @click.prevent="emit('cancel')" />
      </div>
    </div>
  </DialogsBox>
</template>
