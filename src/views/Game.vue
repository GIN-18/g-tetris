<script setup>
import { ref, provide, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { emitter } from '@/assets/js/emitter'
import { factory } from '@/assets/js/factory'
import { Timer } from '@/assets/js/Timer'

import Header from '@/components/Header.vue'
import PlayfieldCanvas from '@/components/canvas/PlayfieldCanvas.vue'
import LeftSideInfo from '@/components/info/LeftSideInfo.vue'
import RightSideInfo from '@/components/info/RightSideInfo.vue'
import GameOverInfo from '@/components/info/GameOverInfo.vue'
import ButtonOperation from '@/components/operation/ButtonOperation.vue'
import KeyOperation from '@/components/operation/KeyOperation.vue'
import Controls from '@/components/info/Controls.vue'

const { indexedDB, DAS, ARR } = storeToRefs(useGameStore())
const route = useRoute()
const mode = route.params.mode
const tetris = ref(factory(mode, DAS.value, ARR.value))
provide('tetris', tetris)

// HACK: 游戏结束的时候保存数据(是否写在这里？)
watch(
  () => tetris.value.gameOver,
  (newValue) => {
    if (newValue) {
      const timestamp = Date.now()

      if (tetris.value.gameOverTitle === 'FINISHED') {
        let record

        if (mode === 'sprint') {
          const minutesSeconds = Timer.formatMinutesSeconds(
            tetris.value.timer.elapsedTime,
          )
          const milliseconds = Timer.formatMilliseconds(
            tetris.value.timer.elapsedTime,
          )
          record = `${minutesSeconds}.${milliseconds}`
        } else if (mode === 'ultra') {
          record = `${tetris.value.sumScore()} points`
        }

        indexedDB.value.open().then(() => {
          indexedDB.value.add({
            mode,
            timestamp,
            record,
          })
        })

        return
      }

      if (mode === 'marathon') {
        indexedDB.value.open().then(() => {
          indexedDB.value.add({
            mode,
            timestamp,
            record: `${tetris.value.sumScore()} points`,
          })
        })
      }
    }
  },
)

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
  indexedDB.value.close()

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

function moveLeft(enable) {
  tetris.value.moveLeft(enable)
}

function moveRight(enable) {
  tetris.value.moveRight(enable)
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
  <Header />

  <main
    class="flex justify-between items-center w-full md:justify-center md:gap-8 md:w-2/3"
  >
    <LeftSideInfo />
    <PlayfieldCanvas />
    <RightSideInfo />
    <GameOverInfo :title="tetris.gameOverTitle" />
  </main>

  <KeyOperation />
  <ButtonOperation />

  <Controls class="hidden md:flex" />
</template>
