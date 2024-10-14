<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'

import DialogsBox from '@/components/DialogsBox.vue'
import LabelBox from '@/components/info/LabelBox.vue'
import Button from '@/components/button/Button.vue'

const game = useGameStore()
const title = ref('GAME OVER')
</script>

<template>
  <DialogsBox :title="title" :is-show="game.gameOver">
    <!-- info -->
    <div class="flex flex-col gap-4 w-72">
      <LabelBox label="Level:">
        <p>{{ game.level }}</p>
      </LabelBox>

      <LabelBox label="Lines:">
        <p>{{ game.lines }}</p>
      </LabelBox>

      <LabelBox label="Score:">
        <p>{{ game.score }}</p>
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
