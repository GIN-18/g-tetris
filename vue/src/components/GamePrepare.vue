<script setup>
import { computed } from "vue";
import { useGameStore } from "@/stores/game.js";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue";
import Button from "@/components/button/Button.vue";

const game = useGameStore();
const emit = defineEmits(["ready", "cancel"]);
const props = defineProps({
  status: Boolean,
  prepared: Number,
  showPrepare: Boolean,
});

const room = localStorage.getItem("room");

const statusClass = computed(() => ({
  "text-nes-deep-red": !props.status,
  "text-nes-deep-green": props.status,
}));
</script>

<template>
  <DialogsBox title="PREPARE" :isShow="props.showPrepare">
    <div class="flex flex-col gap-4 w-80">
      <LabelBox label="Room ID:">
        <span>{{ room }}</span>
      </LabelBox>
      <LabelBox label="Status:">
        <span :class="statusClass">{{
          props.status ? "Ready" : "Not Ready"
        }}</span>
      </LabelBox>
      <LabelBox label="Prepared:">
        <span class="">{{ prepared }} / 2</span>
      </LabelBox>
    </div>
    <div class="flex gap-12">
      <Button type="success" text="Ready" @click.prevent="emit('ready')" />
      <Button type="warning" text="Cancel" @click.prevent="emit('cancel')" />
    </div>
  </DialogsBox>
</template>
