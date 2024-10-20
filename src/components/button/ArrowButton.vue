<script setup>
import { computed } from 'vue'
import Button from './Button.vue'

const arrowName = ['hard-drop', 'right', 'left', 'soft-drop']
const rotateName = ['rotate-right', 'rotate-left']

const props = defineProps({
  type: String,
})

const classList = computed(() => ({
  'text-2xl': true,
  'w-14 h-14': arrowName.includes(props.type),
  'w-32 h-14': rotateName.includes(props.type),
}))

const icon = computed(() => ({
  'icon-[pixelarticons--chevron-right]': props.type === 'right',
  'icon-[pixelarticons--chevron-left]': props.type === 'left',
  'icon-[pixelarticons--arrow-bar-down]': props.type === 'hard-drop',
  'icon-[pixelarticons--chevron-down]': props.type === 'soft-drop',
  'icon-[pixelarticons--redo]': props.type === 'rotate-right',
  'icon-[pixelarticons--undo]': props.type === 'rotate-left',
}))
</script>

<template>
  <div>
    <Button :class="classList" color="red" :icon="icon" />
  </div>
</template>
