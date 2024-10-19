<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { emitter } from '@/assets/js/emitter.js'

import DialogsBox from '@/components/DialogsBox.vue'
import LabelBox from '@/components/info/LabelBox.vue'
import Button from '@/components/button/Button.vue'

const { tetris } = storeToRefs(useGameStore())
const router = useRouter()
const title = ref('GAME OVER')

function replayGame() {
  emitter.emit('replay')
}

function navigateToHome() {
  router.push({ name: 'Home' })
}
</script>

<template>
  <DialogsBox :title="title" :is-show="tetris.gameOver">
    <div class="flex flex-col gap-4 w-72">
      <LabelBox label="Level:">
        <p>{{ tetris.level }}</p>
      </LabelBox>

      <LabelBox label="Lines:">
        <p>{{ tetris.lines }}</p>
      </LabelBox>

      <LabelBox label="Score:">
        <p>{{ tetris.score }}</p>
      </LabelBox>
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
