<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game.js'
import { palette } from '@/assets/js/palette.js'
import { emitter } from '@/assets/js/emitter.js'

const canvas = ref(null)
const width = computed(() => canvas.value.width)
const height = computed(() => canvas.value.height)
const ctx = computed(() => canvas.value.getContext('2d'))

const { block, tetris, isDrawGhostPiece } = storeToRefs(useGameStore())

watch(
  [
    () => tetris.value.matrix,
    () => tetris.value.activeTetromino,
    () => isDrawGhostPiece.value,
  ],
  () => {
    clearCanvas()
    drawPlayfield()
  },
  { deep: true },
)

onMounted(() => {
  canvas.value.width = block.value * 10
  canvas.value.height = block.value * 20

  // 在页面加载时,启动计时器以游戏开始
  // countdownToPlay(3000, () => {
  //   emitter.emit('play')
  // })
})

function drawPlayfield() {
  if (!tetris.value.activeTetromino) return
  drawMatrix()
  drawGhostPiece()
  drawActiveTetromino()
}

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value)
}

function drawMatrix() {
  const w = tetris.value.matrix[0].length
  const h = tetris.value.matrix.length

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!tetris.value.matrix[y][x]) continue

      ctx.value.fillStyle =
        palette.tetrominoColor[tetris.value.matrix[y][x] - 1]
      ctx.value.fillRect(
        x * block.value,
        (y - 2) * block.value,
        block.value,
        block.value,
      )
    }
  }
}

function drawGhostPiece() {
  if (!JSON.parse(isDrawGhostPiece.value)) return

  const tetromino = tetris.value.activeTetromino
  const color = palette.previewColor
  const ghostPieceYOffset = tetris.value.getLandTetrominoYOffset(tetromino.y)
  const piece = tetromino.pieces[tetromino.rotation]

  ctx.value.fillStyle = color
  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][0] + tetromino.x
    const y = piece[i][1] + ghostPieceYOffset

    ctx.value.fillRect(
      x * block.value,
      (y - 2) * block.value,
      block.value,
      block.value,
    )
  }
}

function drawActiveTetromino() {
  const tetromino = tetris.value.activeTetromino
  const color = tetromino.color
  const piece = tetromino.pieces[tetromino.rotation]

  ctx.value.fillStyle = color
  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][0] + tetromino.x
    const y = piece[i][1] + tetromino.y
    ctx.value.fillRect(
      x * block.value,
      (y - 2) * block.value,
      block.value,
      block.value,
    )
  }
}

function drawText(text) {
  ctx.value.font = '32px "Press Start 2p"'
  ctx.value.textAlign = 'center'
  ctx.value.textBaseline = 'middle'
  ctx.value.fillStyle = '#f8f8f8'
  ctx.value.fillText(text, width.value / 2, height.value / 2)
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

    const text = Math.ceil(remainingTime / 1000)

    clearCanvas()
    drawText(text)

    setTimeout(update, interval)
  }

  update()
}
</script>

<template>
  <canvas class="border-4 border-black bg-nes-black" ref="canvas"></canvas>
</template>
