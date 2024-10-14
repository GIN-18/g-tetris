<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGameStore } from '@/stores/game.js'
import { palette } from '@/assets/js/palette.js'

// get canvas info
const canvas = ref(null)
const width = computed(() => canvas.value.width)
const height = computed(() => canvas.value.height)
const ctx = computed(() => canvas.value.getContext('2d'))

const game = useGameStore()

watch(
  [() => game.matrix, () => game.activeTetromino, () => game.isDrawGhostPiece],
  () => {
    drawPlayfield()
  },
  { deep: true },
)

onMounted(() => {
  // set canvas size
  canvas.value.width = game.block * 10
  canvas.value.height = game.block * 20
})

function drawPlayfield() {
  clearCanvas()
  drawMatrix()
  drawGhostPiece()
  drawActiveTetromino()
}

function clearCanvas() {
  ctx.value.clearRect(0, 0, width.value, height.value)
}

function drawMatrix() {
  const w = game.matrix[0].length
  const h = game.matrix.length

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!game.matrix[y][x]) continue

      ctx.value.fillStyle = palette.tetrominoColor[game.matrix[y][x] - 1]
      ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block)
    }
  }
}

function drawGhostPiece() {
  if (!JSON.parse(game.isDrawGhostPiece)) return

  const tetromino = game.activeTetromino
  const color = palette.previewColor
  const ghostPieceYOffset = getGhostPieceYOffset(tetromino.y)
  const piece = tetromino.pieces[tetromino.rotation]

  ctx.value.fillStyle = color
  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][0] + tetromino.x
    const y = piece[i][1] + ghostPieceYOffset

    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block)
  }
}

function drawActiveTetromino() {
  const tetromino = game.activeTetromino
  const color = tetromino.color
  const piece = tetromino.pieces[tetromino.rotation]

  ctx.value.fillStyle = color
  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][0] + tetromino.x
    const y = piece[i][1] + tetromino.y
    ctx.value.fillRect(x * game.block, y * game.block, game.block, game.block)
  }
}

function getGhostPieceYOffset(offset) {
  const tetromino = game.activeTetromino
  const piece = tetromino.pieces[tetromino.rotation]
  const h = game.matrix.length - 2

  for (let i = 0; i < piece.length; i++) {
    const x = piece[i][0] + tetromino.x
    const y = piece[i][1] + offset

    if (
      offset >= tetromino.y &&
      (y > h || (game.matrix[y] && game.matrix[y + 1][x]))
    ) {
      return offset
    }
  }
  return getGhostPieceYOffset(offset + 1)
}
</script>

<template>
  <canvas class="border-4 border-black bg-black" ref="canvas"></canvas>
</template>
