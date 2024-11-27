<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { emitter } from '@/assets/js/emitter'

const keys = ref({
  hard_drop: ' ',
  soft_drop: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  rotate_right: 'ArrowUp',
  rotate_left: 'z',
  rotate_reverse: 'a',
  hold: 'c',
})

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
})

function handleKeyDown(e) {
  switch (e.key) {
    case keys.value.left:
      emitter.emit('left', true)
      break
    case keys.value.right:
      emitter.emit('right', true)
      break
    case keys.value.hard_drop:
      emitter.emit('hardDrop')
      break
    case keys.value.soft_drop:
      emitter.emit('softDrop', true)
      break
    case keys.value.rotate_right:
      emitter.emit('rotateRight')
      break
    case keys.value.rotate_left:
      emitter.emit('rotateLeft')
      break
    case keys.value.rotate_reverse:
      emitter.emit('rotateReverse')
      break
    case keys.value.hold:
      emitter.emit('hold')
      break
  }
}

function handleKeyUp(e) {
  switch (e.key) {
    case keys.value.left:
      emitter.emit('left', false)
      break
    case keys.value.right:
      emitter.emit('right', false)
      break
    case keys.value.soft_drop:
      emitter.emit('softDrop', false)
      break
  }
}
</script>

<!-- TODO: 键盘设置 -->
<template></template>
