<script setup>
import { inject, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Timer } from '@/assets/js/Timer'

import InfoBox from './InfoBox.vue'
import HoldTetrominoCanvas from '@/components/canvas/HoldTetrominoCanvas.vue'

const route = useRoute()
const tetris = inject('tetris')
const mode = route.params.mode
const minutesSeconds = computed(() =>
  formatTimeByMode(mode, Timer.formatMinutesSeconds),
)
const milliseconds = computed(() =>
  formatTimeByMode(mode, Timer.formatMilliseconds),
)

function formatTimeByMode(mode, formatFn) {
  if (mode === 'marathon') return

  const time =
    mode === 'sprint'
      ? tetris.value.timer.elapsedTime
      : tetris.value.timer.countdownTime
  return formatFn(time)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <InfoBox title="HOLD">
      <HoldTetrominoCanvas />
    </InfoBox>

    <div class="flex flex-col gap-6">
      <!-- 竞速模式不显示 -->
      <div class="flex flex-col gap-6" v-if="mode !== 'sprint'">
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

      <!-- 马拉松模式不显示 -->
      <InfoBox title="TIMER" v-if="mode !== 'marathon'">
        <div class="flex flex-col justify-center items-end gap-1">
          <p>{{ minutesSeconds }}</p>
          <p>{{ milliseconds }}</p>
        </div>
      </InfoBox>
    </div>
  </div>
</template>
