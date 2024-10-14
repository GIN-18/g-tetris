<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGameStore } from '@/stores/game.js'

const canvas = ref(null)
const width = computed(() => canvas.value.width)
const height = computed(() => canvas.value.height)
const ctx = computed(() => canvas.value.getContext('2d'))

const game = useGameStore()

watch(
  () => game.currentBag,
  () => {
    clearCanvas()
    drawBag()
  },
  {
    deep: true,
  },
)

onMounted(() => {
  canvas.value.width = game.block * 4
  canvas.value.height = game.block * (2 * 4 + 3)

  clearCanvas()
  drawBag()
})

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value)
}

function drawBag() {
  const bag = game.currentBag

  for (let i = 0; i < bag.length; i++) {
    const color = bag[i].color
    const tetromino = bag[i].pieces[0]
    const xOffset = setXOffset(bag[i].name)
    const yOffset = setYOffset(bag[i].name, i)

    ctx.value.fillStyle = color
    for (let j = 0; j < tetromino.length; j++) {
      const x = tetromino[j][0] + 1 + xOffset
      const y = tetromino[j][1] + 1 + i * 3 + yOffset

      ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block)
    }
  }
}

function setXOffset(name) {
  const arr = ['T', 'L', 'J', 'S', 'Z']

  if (arr.includes(name)) {
    return 1 / 2
  }

  return 0
}

function setYOffset(name) {
  if (name === 'I') {
    return -1 / 2
  }

  return 0
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
