<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'

import DialogsBox from '@/components/DialogsBox.vue'
import LabelBox from '@/components/info/LabelBox.vue'
import Button from '@/components/button/Button.vue'

const { tetris } = storeToRefs(useGameStore())
const title = ref('GAME OVER')
</script>

<template>
  <DialogsBox :title="title" :is-show="tetris.gameOver">
    <!-- info -->
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

    <!-- button -->
    <div class="flex gap-12">
      <!-- again button -->
      <Button
        color="green"
        text="AGAIN"
        @click.prevent="emitter.emit('reset')"
        @touchstart.prevent="emitter.emit('reset')"
      />

      <!-- quit button -->
      <Button
        color="yellow"
        text="Quit"
        @click.prevent="emitter.emit('reset')"
        @touchstart.prevent="emitter.emit('reset')"
      />
    </div>
  </DialogsBox>
</template>

<style scoped>
p {
  @apply mb-0;
}
</style>
