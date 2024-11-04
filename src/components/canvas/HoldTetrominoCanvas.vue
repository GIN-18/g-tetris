<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game.js'

// get canvas info
const canvas = ref(null)
const ctx = computed(() => canvas.value.getContext('2d'))

const { tetris } = storeToRefs(useGameStore())

watch(
  () => tetris.value.holdTetromino,
  () => {
    clearCanvas()
    drawHoldTetromino()
  },
  { deep: true },
)

onMounted(() => {
  canvas.value.width = tetris.value.blockSize * 4
  canvas.value.height = tetris.value.blockSize * 4
})

function clearCanvas() {
  tetris.value.clearCanvas(ctx.value)
}

function drawHoldTetromino() {
  tetris.value.drawHoldTetromino(ctx.value)
}
</script>

<template>
  <canvas class="border-4 border-black bg-nes-black" ref="canvas"></canvas>
</template>
