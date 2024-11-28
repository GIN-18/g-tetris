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
  title: {
    type: String,
    default: 'center',
  },
})

const layout = computed(() => ({
  'flex w-full text-sm md:text-base': true,
  'justify-between': props.type === 'horizontal',
  'flex-col  gap-2': props.type === 'vertical',
  'items-start': props.title === 'left',
  'items-center': props.title === 'center',
  'items-end': props.title === 'right',
}))
</script>

<template>
  <div :class="layout">
    <p class="whitespace-nowrap">{{ props.label }}</p>
    <slot></slot>
  </div>
</template>
