<script setup>
import { computed } from "vue";

import Button from "./Button.vue";

const props = defineProps({
  type: String,
});

const icon = computed(() => ({
  "icon-[pixelarticons--arrow-bar-down]": props.type === "drop",
  "icon-[pixelarticons--chevron-right]": props.type === "right",
  "icon-[pixelarticons--chevron-left]": props.type === "left",
  "icon-[pixelarticons--chevron-down]": props.type === "down",
}));
</script>

<template>
  <div>
    <Button type="arrow" :icon="icon" />
  </div>
</template>
