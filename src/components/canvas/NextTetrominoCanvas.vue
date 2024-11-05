<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue'
const canvas = ref(null)
const ctx = computed(() => canvas.value.getContext('2d'))

const tetris = inject('tetris')

watch(
  () => tetris.value.currentBag,
  () => {
    clearCanvas()
    drawBag()
  },
  {
    deep: true,
  },
)

onMounted(() => {
  canvas.value.width = tetris.value.blockSize * 4
  canvas.value.height = tetris.value.blockSize * (2 * 4 + 3)

  clearCanvas()
  drawBag()
})

function clearCanvas() {
  tetris.value.clearCanvas(ctx.value)
}

function drawBag() {
  tetris.value.drawBag(ctx.value)
}
</script>

<template>
  <canvas class="border-4 border-black bg-nes-black" ref="canvas"></canvas>
</template>
