<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { emitter } from '@/assets/js/emitter'
import { factory } from '@/assets/js/factory'

import Header from '@/components/Header.vue'
import Menu from '@/components/menu/Menu.vue'
import PlayfieldCanvas from '@/components/canvas/PlayfieldCanvas.vue'
import LeftSideInfo from '@/components/info/LeftSideInfo.vue'
import RightSideInfo from '@/components/info/RightSideInfo.vue'
import GameOverInfo from '@/components/info/GameOverInfo.vue'
import ButtonOperation from '@/components/operation/ButtonOperation.vue'
import KeyOperation from '@/components/operation/KeyOperation.vue'

const route = useRoute()
const mode = route.params.mode
const tetris = ref(factory(mode))
provide('tetris', tetris)

onMounted(() => {
  emitter.on('play', playGame)
  emitter.on('reset', resetGame)
  emitter.on('replay', replayGame)
  emitter.on('left', moveLeft)
  emitter.on('right', moveRight)
  emitter.on('hardDrop', hardDrop)
  emitter.on('softDrop', softDrop)
  emitter.on('rotateRight', rotateRight)
  emitter.on('rotateLeft', rotateLeft)
  emitter.on('rotateReverse', rotateFlip)
  emitter.on('hold', holdTetromino)
})

onUnmounted(() => {
  emitter.off('play', playGame)
  emitter.off('reset', resetGame)
  emitter.off('replay', replayGame)
  emitter.off('left', moveLeft)
  emitter.off('right', moveRight)
  emitter.off('hardDrop', hardDrop)
  emitter.off('softDrop', softDrop)
  emitter.off('rotateRight', rotateRight)
  emitter.off('rotateLeft', rotateLeft)
  emitter.off('rotateReverse', rotateFlip)
  emitter.off('hold', holdTetromino)
})

onBeforeRouteLeave((to, from, next) => {
  emitter.emit('clearCountdownTimer') // 清除开始游戏的计时器
  resetGame()
  next()
})

function replayGame() {
  resetGame()
  playGame()
}

function playGame() {
  tetris.value.playGame()
}

function resetGame() {
  tetris.value.resetGame()
}

function moveLeft() {
  tetris.value.moveLeft()
}

function moveRight() {
  tetris.value.moveRight()
}

function hardDrop() {
  tetris.value.hardDrop()
}

function softDrop(enable) {
  tetris.value.softDrop(enable)
}

function rotateRight() {
  tetris.value.rotateRight()
}

function rotateLeft() {
  tetris.value.rotateLeft()
}

function rotateFlip() {
  tetris.value.rotateFlip()
}

function holdTetromino() {
  tetris.value.updateHoldTetromino()
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

  <GameOverInfo :title="tetris.gameOverTitle" />
</template>
