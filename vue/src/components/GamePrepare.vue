<script setup>
import { computed } from "vue";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue";
import Button from "@/components/button/Button.vue";
import StatusButton from "@/components/button/StatusButton.vue";

const emit = defineEmits(["ready", "quit"]);
const props = defineProps({
  isReady: Boolean,
  prepared: Number,
  showPrepare: Boolean,
});

const room = localStorage.getItem("room");

const statusClass = computed(() => ({
  "text-nes-deep-red": !props.isReady,
  "text-nes-deep-green": props.isReady,
}));
const type = computed(() => (props.isReady ? "error" : "success"));
</script>

<template>
  <DialogsBox title="PREPARE" :isShow="props.showPrepare">
    <div class="flex flex-col gap-4 w-72">
      <!-- room id -->
      <LabelBox label="Room ID:">
        <span>{{ room }}</span>
      </LabelBox>

      <!-- prepare status -->
      <LabelBox label="Status:">
        <span :class="statusClass">{{
          props.isReady ? "Ready" : "Not Ready"
        }}</span>
      </LabelBox>

      <!-- number of prepared -->
      <LabelBox label="Prepared:">
        <span class="">{{ prepared }} / 2</span>
      </LabelBox>
    </div>

    <div class="flex gap-12">
      <!-- ready or cancel button -->
      <StatusButton
        :type="type"
        :status="props.isReady"
        trueText="CANCEL"
        falseText="READY"
        @click.prevent="emit('ready')"
      />

      <!-- quit button -->
      <Button type="warning" text="QUIT" @click.prevent="emit('quit')" />
    </div>
  </DialogsBox>
</template>
