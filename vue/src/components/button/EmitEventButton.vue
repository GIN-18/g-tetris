<script setup>
import { computed, nextTick } from "vue";
import { socketEmit } from "@/assets/js/socket.js";

import StatusButton from "./StatusButton.vue";

const attr = defineModel("attr");
const props = defineProps({
  event: String,
});

const type = computed(() => (attr.value ? "error" : "success"));
const falseText = computed(() => props.event.toUpperCase());

async function emitEvent() {
  await nextTick(() => {
    attr.value = !attr.value;
  });
  socketEmit(props.event, props.event, attr.value);
}
</script>

<template>
  <div>
    <StatusButton
      :type="type"
      :status="attr"
      trueText="CANCEL"
      :falseText="falseText"
      @click.prevent="emitEvent"
    />
  </div>
</template>
