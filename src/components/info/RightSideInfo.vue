<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game.js'

import InfoBox from './InfoBox.vue'
import NextTetrominoCanvas from '@/components/canvas/NextTetrominoCanvas.vue'

const { tetris } = storeToRefs(useGameStore())
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <InfoBox title="NEXT">
      <NextTetrominoCanvas />
    </InfoBox>

    <InfoBox border title="SCORE">
      <p>{{ tetris.score }}</p>
    </InfoBox>
  </div>
</template>
