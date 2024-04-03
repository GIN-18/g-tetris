<script setup>
import { computed } from "vue";

import Button from "./Button.vue";

const props = defineProps({
  status: Boolean,
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
    <Button type="primary" :icon="icon" :text="text" @click="emit('toggle')" />
  </div>
</template>
