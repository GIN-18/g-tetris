<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { emitter } from '@/assets/js/emitter.js'

import DialogsBox from '@/components/DialogsBox.vue'
import LabelBox from '@/components/info/LabelBox.vue'
import Button from '@/components/button/Button.vue'

const { tetris } = storeToRefs(useGameStore())
const route = useRoute()
const router = useRouter()
const title = ref('GAME OVER')

function replayGame() {
  emitter.emit('replay')
}

function navigateToHome() {
  router.push({ name: 'home' })
}

function checkGameMode(mode) {
  return route.params.mode === mode
}
</script>

<template>
  <DialogsBox :title="title" :is-show="tetris.gameOver">
    <div class="flex flex-col gap-4 w-72">
      <LabelBox label="Lines:">
        <p>{{ tetris.lines }}</p>
      </LabelBox>

      <!-- 马拉松模式显示 -->
      <div class="flex flex-col gap-4" v-if="checkGameMode('marathon')">
        <LabelBox label="Level:">
          <p>{{ tetris.level }}</p>
        </LabelBox>

        <!-- HACK: 是否星星和金币 -->
        <LabelBox label="Score:">
          <p>{{ tetris.sumScore() }}</p>
        </LabelBox>
      </div>
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
        text="Quit"
        @click.prevent="navigateToHome"
        @touchstart.prevent="navigateToHome"
      />
    </div>
  </DialogsBox>
</template>
