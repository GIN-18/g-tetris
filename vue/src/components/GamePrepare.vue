<script setup>
import { computed } from "vue";

import DialogsBox from "@/components/DialogsBox.vue";
import LabelBox from "@/components/LabelBox.vue";
import Button from "@/components/button/Button.vue";
import StatusButton from "@/components/button/StatusButton.vue";

const emit = defineEmits(["ready", "quit"]);
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
    <div class="flex flex-col gap-4 w-72">
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
      <StatusButton
        :status="props.status"
        trueText="CANCEL"
        falseText="READY"
        @click.prevent="emit('ready')"
      />
      <Button type="warning" text="QUIT" @click.prevent="emit('quit')" />
    </div>
  </DialogsBox>
</template>
