<script setup>
import { computed } from "vue";

import Button from "./Button.vue";

const props = defineProps({
  status: Boolean,
});

const emit = defineEmits(["play"]);

const icon = computed(() =>
  props.status ? "icon-[pixelarticons--pause]" : "icon-[pixelarticons--play]",
);
</script>

<template>
  <div>
    <Button type="primary" :icon="icon" @click="emit('play')" />
  </div>
</template>
