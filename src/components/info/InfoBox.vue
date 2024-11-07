<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'vertical',
  },
  label: {
    type: String,
    required: true,
  },
})

const layout = computed(() => ({
  'flex items-center w-full text-sm': true,
  'justify-between': props.type === 'horizontal',
  'flex-col justify-center gap-2': props.type === 'vertical',
}))
</script>

<template>
  <div :class="layout">
    <p class="whitespace-nowrap">{{ props.label }}</p>
    <slot></slot>
  </div>
</template>
