<script setup>
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import { Timer } from '@/assets/js/Timer'

import InfoBox from './InfoBox.vue'
import HoldTetrominoCanvas from '@/components/canvas/HoldTetrominoCanvas.vue'

const route = useRoute()
const tetris = inject('tetris')

function checkMode(mode) {
  return route.params.mode === mode
}
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <InfoBox title="HOLD">
      <HoldTetrominoCanvas />
    </InfoBox>

    <!-- 竞速模式显示 -->
    <div class="flex flex-col gap-6" v-if="checkMode('sprint')">
      <InfoBox title="TIMER">
        <div class="flex flex-col justify-center items-end gap-1">
          <p>{{ Timer.formatMinutesSeconds(tetris.timer.elapsed) }}</p>
          <p>{{ Timer.formatMilliseconds(tetris.timer.elapsed) }}</p>
        </div>
      </InfoBox>
    </div>

    <!-- 马拉松模式显示 -->
    <div class="flex flex-col gap-6" v-if="checkMode('marathon')">
      <InfoBox title="LEVEL">
        <p>{{ tetris.level }}</p>
      </InfoBox>

      <InfoBox title="SCORE">
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
