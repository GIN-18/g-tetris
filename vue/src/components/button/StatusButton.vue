<script setup>
import { computed } from "vue";

import Button from "./Button.vue";

const props = defineProps({
  status: Boolean,
  type: {
    type: String,
    default: "primary",
  },
  trueIcon: String,
  falseIcon: String,
  trueText: String,
  falseText: String,
});

const emit = defineEmits(["toggle"]);

const icon = computed(() => (props.status ? props.trueIcon : props.falseIcon));
const text = computed(() => (props.status ? props.trueText : props.falseText));
</script>

<template>
  <div>
    <Button :type="type" :icon="icon" :text="text" @click="emit('toggle')" />
  </div>
</template>
