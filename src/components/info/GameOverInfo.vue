<script setup>
import { inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { emitter } from '@/assets/js/emitter'
import { Timer } from '@/assets/js/Timer'

import Dialog from '@/components/common/Dialog.vue'
import InfoBox from '@/components/info/InfoBox.vue'
import Button from '@/components/button/Button.vue'

const tetris = inject('tetris')
const router = useRouter()
const finalScore = computed(() => tetris.value.sumScore())
const spins = computed(
  () => tetris.value.TSpinCount + tetris.value.miniTSpinCount,
)

const props = defineProps({
  title: {
    type: String,
    default: 'GAME OVER',
  },
})

function replayGame() {
  emitter.emit('replay')
}

function goToHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <Dialog :title="title" :is-show="tetris.gameOver">
    <div class="flex flex-col gap-4 w-72 text-sm md:text-base">
      <!-- 显示行数 -->
      <InfoBox label="Lines:" type="horizontal">
        <p>{{ tetris.lines }}</p>
      </InfoBox>

      <!-- 竞速模式显示 -->
      <InfoBox label="Time:" type="horizontal" v-if="tetris.mode === 'sprint'">
        <p>
          <span>
            {{ Timer.formatMinutesSeconds(tetris.timer.elapsedTime) }}
          </span>
          <span>.</span>
          <span>
            {{ Timer.formatMilliseconds(tetris.timer.elapsedTime) }}
          </span>
        </p>
      </InfoBox>

      <!-- 马拉松模式和限时打分模式显示 -->
      <div class="flex flex-col gap-4 w-72" v-if="tetris.mode !== 'sprint'">
        <InfoBox label="Level:" type="horizontal">
          <p>{{ tetris.level }}</p>
        </InfoBox>

        <!-- HACK: 是否星星和金币 -->
        <InfoBox label="Score:" type="horizontal">
          <p>{{ finalScore }}</p>
        </InfoBox>
      </div>

      <InfoBox label="Tetris:" type="horizontal">
        <p>{{ tetris.tetrisCount }}</p>
      </InfoBox>

      <InfoBox label="Spins:" type="horizontal">
        <p>{{ spins }}</p>
      </InfoBox>

      <InfoBox label="Max Combo:" type="horizontal">
        <p>{{ tetris.maxComboCount }}</p>
      </InfoBox>

      <InfoBox label="Max B2B Chain:" type="horizontal">
        <p>{{ tetris.maxBackToBackCount }}</p>
      </InfoBox>
    </div>

    <div class="flex gap-12">
      <Button
        color="green"
        text="AGAIN"
        @click.prevent="replayGame"
        @touchstart.prevent="replayGame"
      />

      <Button
        color="yellow"
        text="QUIT"
        @click.prevent="goToHome"
        @touchstart.prevent="goToHome"
      />
    </div>
  </Dialog>
</template>
