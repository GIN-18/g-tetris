<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { emitter } from '@/assets/js/emitter'

const canvas = ref(null)
const ctx = computed(() => canvas.value.getContext('2d'))

const tetris = inject('tetris')
const { isDrawGhostPiece } = storeToRefs(useGameStore())

let countdownTimerId = null

watch(
  [
    () => tetris.value.matrix,
    () => tetris.value.activeTetromino,
    () => isDrawGhostPiece.value,
    () => tetris.value.messageDuration,
  ],
  () => {
    clearCanvas()
    drawPlayfield()
    drawMessage()
  },
  { deep: true },
)

onMounted(() => {
  canvas.value.width = tetris.value.blockSize * 10
  canvas.value.height = tetris.value.blockSize * 20

  // 在页面加载时,启动计时器以游戏开始
  countdownToPlay(3000, () => {
    emitter.emit('play')
  })

  // 退出页面的时候清除计时器
  emitter.on('clearCountdownTimer', () => {
    if (countdownTimerId) {
      clearInterval(countdownTimerId)
      countdownTimerId = null
    }
  })
})

function drawPlayfield() {
  if (!tetris.value.activeTetromino) return
  drawMatrix()
  drawGhostPiece()
  drawActiveTetromino()
}

function clearCanvas() {
  tetris.value.clearCanvas(ctx.value)
}

function drawMatrix() {
  tetris.value.drawMatrix(ctx.value)
}

function drawGhostPiece() {
  if (!JSON.parse(isDrawGhostPiece.value)) return
  tetris.value.drawGhostPiece(ctx.value)
}

function drawActiveTetromino() {
  tetris.value.drawActiveTetromino(ctx.value)
}

function drawMessage() {
  if (!tetris.value.messageList.length) return
  tetris.value.drawText(ctx.value, tetris.value.messageList[0])
}

function countdownToPlay(duration, callback) {
  const startTime = Date.now()
  const interval = 1000 // 1秒钟更新一次

  function update() {
    const currentTime = Date.now()
    const remainingTime = duration - (currentTime - startTime)

    if (remainingTime <= -interval) {
      callback()
      return
    }

    const mins = Math.ceil(remainingTime / 1000)

    clearCanvas()
    tetris.value.drawText(ctx.value, mins, '32px')

    countdownTimerId = setTimeout(update, interval)
  }

  update()
}
</script>

<template>
  <canvas class="border-4 border-black bg-nes-black" ref="canvas"></canvas>
</template>
