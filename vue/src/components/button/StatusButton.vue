<script setup>
import { computed } from "vue";
import { emitter } from "@/assets/js/emitter.js";
import Button from "./Button.vue";

const props = defineProps({
  type: {
    type: String,
    default: "primary",
  },
  status: Boolean,
  event: String,
  trueIcon: String,
  falseIcon: String,
  trueText: String,
  falseText: String,
});

const icon = computed(() => (props.status ? props.trueIcon : props.falseIcon));
const text = computed(() => (props.status ? props.trueText : props.falseText));
</script>

<template>
  <div>
    <Button
      :type="type"
      :icon="icon"
      :text="text"
      @click.prevent="emitter.emit(event)"
    />
  </div>
</template>
