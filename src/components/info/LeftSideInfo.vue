<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/game.js'

import InfoBox from './InfoBox.vue'
import HoldTetrominoCanvas from '@/components/canvas/HoldTetrominoCanvas.vue'

const { tetris } = storeToRefs(useGameStore())
const route = useRoute()

function checkMode(mode) {
  return route.params.mode === mode
}
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <InfoBox title="HOLD">
      <HoldTetrominoCanvas />
    </InfoBox>

    <!-- 马拉松模式显示 -->
    <div class="flex flex-col gap-6" v-if="checkMode('marathon')">
      <InfoBox border title="LEVEL">
        <p>{{ tetris.level }}</p>
      </InfoBox>

      <InfoBox border title="SCORE">
        <div class="flex gap-2" v-if="tetris.starCount">
          <i class="nes-icon is-small star"></i>
          <p>x</p>
          <p>{{ tetris.starCount }}</p>
        </div>

        <div class="flex gap-2" v-if="tetris.coinCount">
          <i class="nes-icon is-small coin"></i>
          <p>x</p>
          <p>{{ tetris.coinCount }}</p>
        </div>

        <p>{{ tetris.score }}</p>
      </InfoBox>
    </div>
  </div>
</template>
