<script setup>
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game.js'
import { emitter } from '@/assets/js/emitter.js'
import { notify } from '@/assets/js/notify.js'

import Header from '@/components/Header.vue'
import Menu from '@/components/menu/Menu.vue'
import PlayfieldCanvas from '@/components/canvas/PlayfieldCanvas.vue'
import LeftSideInfo from '@/components/info/LeftSideInfo.vue'
import RightSideInfo from '@/components/info/RightSideInfo.vue'
import GameOverInfo from '@/components/info/GameOverInfo.vue'
import ButtonOperation from '@/components/operation/ButtonOperation.vue'
import KeyOperation from '@/components/operation/KeyOperation.vue'

const { tetris } = storeToRefs(useGameStore())

onMounted(() => {
  // requestAnimationFrame(gameLoop)

  emitter.on('play', playGame)
  emitter.on('left', moveTetrominoLeft)
  emitter.on('right', moveTetrominoRight)
  emitter.on('hardDrop', hardDropTetromino)
  emitter.on('softDrop', softDropTetromino)
  emitter.on('rotateRight', rotateRight)
  emitter.on('rotateLeft', rotateLeft)
  emitter.on('rotateReverse', rotateFlip)
  emitter.on('hold', holdTetromino)
})

onUnmounted(() => {
  emitter.off('play', playGame)
  emitter.off('left', moveTetrominoLeft)
  emitter.off('right', moveTetrominoRight)
  emitter.off('hardDrop', hardDropTetromino)
  emitter.off('softDrop', softDropTetromino)
  emitter.off('rotateRight', rotateRight)
  emitter.off('rotateLeft', rotateLeft)
  emitter.off('rotateReverse', rotateFlip)
  emitter.off('hold', holdTetromino)
})

function playGame() {
  tetris.value.addTetromino()
}

function gameLoop(currentTime) {
  const dropInterval = tetris.value.getDropInterval(tetris.value.level) * 1000
  const deltaTime = currentTime - tetris.value.lastRenderTime

  if (deltaTime > dropInterval) {
    if (!tetris.value.activeTetromino) {
      tetris.value.addTetromino()
    }
    fallTetrominoToLand()

    tetris.value.lastRenderTime = currentTime
  }

  requestAnimationFrame(gameLoop)
}

// 方块左移
function moveTetrominoLeft() {
  tetris.value.moveTetromino(-1, 0)
}

// 方块右移
function moveTetrominoRight() {
  tetris.value.moveTetromino(1, 0)
}

// 方块硬降
function hardDropTetromino() {
  while (tetris.value.moveTetromino(0, 1)) {}
  landTetromino()
}

// 方块软降
function softDropTetromino(enable) {
  if (enable && !tetris.value.moveTetromino(0, 1)) {
    landTetromino()
  }
}

function rotateRight() {
  tetris.value.rotateTetromino(1)
}

function rotateLeft() {
  tetris.value.rotateTetromino(-1)
}

function rotateFlip() {
  tetris.value.rotateTetromino(2)
}

function holdTetromino() {
  tetris.value.updateHoldTetromino()
}

function fallTetrominoToLand() {
  if (!tetris.value.moveTetromino(0, 1)) {
    landTetromino()
  }
}

function landTetromino() {
  tetris.value.landTetromino()
}

function checkCombo() {
  if (tetris.value.isCombo) {
    notify('warning', `Combo: ${tetris.value.comboNum - 1}`)
  }
}
</script>

<template>
  <Header>
    <Menu />
  </Header>

  <main class="flex justify-between items-center w-full">
    <LeftSideInfo />
    <PlayfieldCanvas />
    <RightSideInfo />
  </main>

  <ButtonOperation />
  <KeyOperation />

  <GameOverInfo />
</template>
