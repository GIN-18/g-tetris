<script setup>
import { computed } from "vue";
import Button from "./Button.vue";

const icon = computed(() => ({
  "icon-[pixelarticons--arrow-bar-down]": props.type === "drop",
  "icon-[pixelarticons--chevron-right]": props.type === "right",
  "icon-[pixelarticons--chevron-left]": props.type === "left",
  "icon-[pixelarticons--chevron-down]": props.type === "down",
  "icon-[pixelarticons--redo]": props.type === "rotate",
}));

const props = defineProps({
  type: String,
});

function checkType() {
  const arr = ["drop", "right", "left", "down"];
  return arr.includes(props.type) ? "arrow" : "rotate";
}
</script>

<template>
  <div>
    <Button :type="checkType()" :icon="icon" />
  </div>
</template>
