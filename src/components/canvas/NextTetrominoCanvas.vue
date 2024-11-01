<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game.js'

const canvas = ref(null)
const width = computed(() => canvas.value.width)
const height = computed(() => canvas.value.height)
const ctx = computed(() => canvas.value.getContext('2d'))

const { block, tetris } = storeToRefs(useGameStore())

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
  canvas.value.width = block.value * 4
  canvas.value.height = block.value * (2 * 4 + 3)

  clearCanvas()
  drawBag()
})

function clearCanvas() {
  tetris.value.clearCanvas(ctx.value, width.value, height.value)
}

function drawBag() {
  tetris.value.drawBag(ctx.value)
}
</script>

<template>
  <canvas class="border-4 border-black bg-nes-black" ref="canvas"></canvas>
</template>
