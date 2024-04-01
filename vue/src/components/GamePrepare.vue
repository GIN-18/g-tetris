<script setup>
import { computed } from "vue";
import { useGameStore } from "@/stores/game.js";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue";
import Button from "@/components/Button.vue";

const game = useGameStore();
const emit = defineEmits(["ready", "cancel"]);
const props = defineProps({
  status: Boolean,
  prepared: Number,
});

const statusClass = computed(() => ({
  "text-nes-deep-red": !props.status,
  "text-nes-deep-green": props.status,
}));
</script>

<template>
  <DialogsBox title="PREPARE">
    <div class="flex flex-col gap-4 text-sm w-72">
      <LabelBox label="Room ID:">
        <span>{{ game.room }}</span>
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
      <Button
        description="success"
        text="Ready"
        @click.prevent="emit('ready')"
      />
      <Button
        description="warning"
        text="Cancel"
        @click.prevent="emit('cancel')"
      />
    </div>
  </DialogsBox>
</template>
